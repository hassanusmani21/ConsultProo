import { randomUUID } from 'node:crypto';
import { Buffer } from 'node:buffer';

const allowedCurrencies = new Set(['INR']);
const minimumAmountPaise = 100;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const indianMobilePattern = /^(?:\+91|91|0)?[6-9]\d{9}$/;

const responseHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};

const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: responseHeaders,
});

const normalizeText = (value) => typeof value === 'string' ? value.trim() : '';

const validateGenericOrder = (payload) => {
  const amount = Number(payload?.amount);
  const currency = normalizeText(payload?.currency).toUpperCase();
  const receipt = normalizeText(payload?.receipt);

  if (!Number.isInteger(amount) || amount < minimumAmountPaise) {
    return { error: `Amount must be an integer of at least ${minimumAmountPaise} paise.` };
  }
  if (!allowedCurrencies.has(currency)) return { error: 'Only INR payments are supported.' };
  if (!receipt || receipt.length > 40) return { error: 'A receipt between 1 and 40 characters is required.' };

  return { amount, currency, receipt };
};

const validateRequest = (payload) => {
  const customer = payload?.customer;
  const productId = normalizeText(payload?.product?.id);
  const idempotencyKey = normalizeText(payload?.idempotencyKey || payload?.idempotency_key);
  const fullName = normalizeText(customer?.fullName);
  const email = normalizeText(customer?.email).toLowerCase();
  const mobile = normalizeText(customer?.mobile).replace(/[\s-]/g, '');

  if (fullName.length < 2 || fullName.length > 100) return { error: 'A valid full name is required.' };
  if (email.length > 254 || !emailPattern.test(email)) return { error: 'A valid email address is required.' };
  if (!indianMobilePattern.test(mobile)) return { error: 'A valid Indian mobile number is required.' };
  if (!productId || productId.length > 120) return { error: 'A valid product is required.' };
  if (!idempotencyKey || idempotencyKey.length > 100) return { error: 'A valid checkout idempotency key is required.' };

  return { customer: { fullName, email, mobile }, productId, idempotencyKey };
};

const getConfig = () => ({
  supabaseUrl: process.env.SUPABASE_URL?.replace(/\/$/, ''),
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
});

const supabaseHeaders = (serviceRoleKey) => ({
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  'Content-Type': 'application/json',
});

const getProduct = async (supabaseUrl, serviceRoleKey, productId) => {
  const query = new URLSearchParams({
    id: `eq.${productId}`,
    active: 'eq.true',
    select: 'id,name,price,currency',
    limit: '1',
  });
  const response = await fetch(`${supabaseUrl}/rest/v1/products?${query}`, {
    headers: supabaseHeaders(serviceRoleKey),
  });

  if (!response.ok) throw new Error(`Product lookup failed with status ${response.status}`);
  const products = await response.json();
  return products[0] || null;
};

const getExistingOrder = async (supabaseUrl, serviceRoleKey, idempotencyKey) => {
  const query = new URLSearchParams({
    client_order_id: `eq.${idempotencyKey}`,
    select: 'id,status,razorpay_order_id',
    limit: '1',
  });
  const response = await fetch(`${supabaseUrl}/rest/v1/orders?${query}`, {
    headers: supabaseHeaders(serviceRoleKey),
  });
  if (!response.ok) throw new Error(`Existing order lookup failed with status ${response.status}`);
  const orders = await response.json();
  return orders[0] || null;
};

const createRazorpayOrder = async ({ keyId, keySecret, amount, currency, receipt, productId, internalOrderId }) => {
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const orderPayload = { amount, currency, receipt };
  if (productId || internalOrderId) {
    orderPayload.notes = { product_id: productId, internal_order_id: internalOrderId };
  }
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderPayload),
  });

  if (!response.ok) {
    const error = new Error(`Razorpay order creation failed with status ${response.status}`);
    error.status = response.status;
    error.details = await response.json().catch(() => null);
    throw error;
  }

  return response.json();
};

export default async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: responseHeaders });
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'Request body must be valid JSON.' }, 400);
  }

  const isGenericOrder = !payload?.product && !payload?.customer;
  const validated = isGenericOrder ? null : validateRequest(payload);
  if (validated?.error) return jsonResponse({ error: validated.error }, 400);

  const config = getConfig();
  if (!config.razorpayKeyId || !config.razorpayKeySecret) {
    return jsonResponse({ error: 'Payment service is not configured yet.' }, 503);
  }

  if (isGenericOrder) {
    const validatedOrder = validateGenericOrder(payload);
    if (validatedOrder.error) return jsonResponse({ error: validatedOrder.error }, 400);

    try {
      const razorpayOrder = await createRazorpayOrder({
        keyId: config.razorpayKeyId,
        keySecret: config.razorpayKeySecret,
        ...validatedOrder,
      });

      return jsonResponse({
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderId: razorpayOrder.id,
        status: 'PENDING_PAYMENT',
        razorpayOrderId: razorpayOrder.id,
        keyId: config.razorpayKeyId,
      }, 201);
    } catch (error) {
      console.error('Razorpay generic order request failed:', error);
      if (error?.status === 401) return jsonResponse({ error: 'Payment service authentication failed.' }, 401);
      return jsonResponse({ error: 'Payment order creation failed.' }, 500);
    }
  }

  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
    return jsonResponse({ error: 'Order storage is not configured. Payment cannot be started yet.' }, 503);
  }

  let product;
  try {
    product = await getProduct(config.supabaseUrl, config.supabaseServiceRoleKey, validated.productId);
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: 'The product price could not be verified.' }, 502);
  }

  if (!product) return jsonResponse({ error: 'This product is unavailable.' }, 404);

  const productPrice = Number(product.price);
  const productCurrency = normalizeText(product.currency).toUpperCase();
  if (!Number.isFinite(productPrice) || productPrice <= 0 || productPrice > 100000000) {
    return jsonResponse({ error: 'This product has an invalid price.' }, 422);
  }
  if (!allowedCurrencies.has(productCurrency)) {
    return jsonResponse({ error: 'This product is not available for Razorpay yet.' }, 422);
  }

  const amountInPaise = Math.round(productPrice * 100);
  if (amountInPaise < minimumAmountPaise) {
    return jsonResponse({ error: `This product price must be at least ${minimumAmountPaise} paise.` }, 400);
  }

  let existingOrder;
  try {
    existingOrder = await getExistingOrder(
      config.supabaseUrl,
      config.supabaseServiceRoleKey,
      validated.idempotencyKey,
    );
  } catch (error) {
    console.error('Existing order lookup failed:', error);
    return jsonResponse({ error: 'The order could not be checked. Please try again.' }, 502);
  }

  if (existingOrder?.razorpay_order_id) {
    return jsonResponse({
      order_id: existingOrder.razorpay_order_id,
      amount: amountInPaise,
      currency: productCurrency,
      orderId: existingOrder.id,
      status: existingOrder.status,
      razorpayOrderId: existingOrder.razorpay_order_id,
      keyId: config.razorpayKeyId,
      product: {
        id: product.id,
        name: product.name,
        price: productPrice,
        currency: productCurrency,
      },
    }, 200);
  }

  const internalOrderId = randomUUID();
  let razorpayOrder;
  try {
    razorpayOrder = await createRazorpayOrder({
      keyId: config.razorpayKeyId,
      keySecret: config.razorpayKeySecret,
      amount: amountInPaise,
      currency: productCurrency,
      receipt: `order_${internalOrderId.replace(/-/g, '').slice(0, 24)}`,
      productId: product.id,
      internalOrderId,
    });
  } catch (error) {
    console.error('Razorpay request failed:', error);
    if (error?.status === 401) return jsonResponse({ error: 'Payment service authentication failed.' }, 401);
    return jsonResponse({ error: 'Payment order creation failed.' }, 500);
  }

  if (!razorpayOrder?.id || !razorpayOrder.amount) {
    return jsonResponse({ error: 'Payment order creation failed.' }, 500);
  }

  let databaseResponse;
  try {
    databaseResponse = await fetch(`${config.supabaseUrl}/rest/v1/rpc/create_pending_order`, {
      method: 'POST',
      headers: supabaseHeaders(config.supabaseServiceRoleKey),
      body: JSON.stringify({
        p_order_id: internalOrderId,
        p_customer_full_name: validated.customer.fullName,
        p_customer_email: validated.customer.email,
        p_customer_phone: validated.customer.mobile,
        p_product_id: product.id,
        p_razorpay_order_id: razorpayOrder.id,
        p_client_order_id: validated.idempotencyKey,
      }),
    });
  } catch (error) {
    console.error('Order database request failed after Razorpay order creation:', error);
    return jsonResponse({ error: 'The order could not be saved. Please try again.' }, 502);
  }

  const databaseResult = await databaseResponse.json().catch(() => ({}));
  if (!databaseResponse.ok || !databaseResult?.order_id || !databaseResult?.razorpay_order_id) {
    console.error('Order database insert failed after Razorpay order creation:', databaseResponse.status);
    return jsonResponse({ error: 'The order could not be saved. Please try again.' }, 502);
  }

  const persistedOrderId = databaseResult.order_id;
  const persistedRazorpayOrderId = databaseResult.razorpay_order_id;

  return jsonResponse({
    order_id: persistedRazorpayOrderId,
    amount: amountInPaise,
    currency: productCurrency,
    orderId: persistedOrderId,
    status: databaseResult.status || 'PENDING_PAYMENT',
    razorpayOrderId: persistedRazorpayOrderId,
    keyId: config.razorpayKeyId,
    product: {
      id: product.id,
      name: product.name,
      price: productPrice,
      currency: productCurrency,
    },
  }, 201);
};
