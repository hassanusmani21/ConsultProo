import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { Buffer } from 'node:buffer';

const responseHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};

const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: responseHeaders,
});

const normalizeText = (value) => typeof value === 'string' ? value.trim() : '';

const getConfig = () => ({
  supabaseUrl: process.env.SUPABASE_URL?.replace(/\/$/, ''),
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
});

const supabaseHeaders = (serviceRoleKey) => ({
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  'Content-Type': 'application/json',
});

const validateRequest = (payload) => {
  const orderId = normalizeText(payload?.orderId);
  const razorpayOrderId = normalizeText(payload?.razorpayOrderId || payload?.razorpay_order_id);
  const razorpayPaymentId = normalizeText(payload?.razorpayPaymentId || payload?.razorpay_payment_id);
  const razorpaySignature = normalizeText(payload?.razorpaySignature || payload?.razorpay_signature);

  if (!orderId || orderId.length > 80) return { error: 'A valid internal order ID is required.' };
  if (!razorpayOrderId || razorpayOrderId.length > 100) return { error: 'A valid Razorpay order ID is required.' };
  if (!razorpayPaymentId || razorpayPaymentId.length > 100) return { error: 'A valid Razorpay payment ID is required.' };
  if (!/^[a-f0-9]{64}$/i.test(razorpaySignature)) return { error: 'A valid Razorpay signature is required.' };

  return { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature };
};

const signatureMatches = (secret, razorpayOrderId, razorpayPaymentId, signature) => {
  const expected = createHmac('sha256', secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest();
  const received = Buffer.from(signature, 'hex');
  return expected.length === received.length && timingSafeEqual(expected, received);
};

const getStoredOrder = async (config, orderId) => {
  const query = new URLSearchParams({
    id: `eq.${orderId}`,
    select: 'id,status,product_id,product_price,product_currency,razorpay_order_id,razorpay_payment_id',
    limit: '1',
  });
  const response = await fetch(`${config.supabaseUrl}/rest/v1/orders?${query}`, {
    headers: supabaseHeaders(config.supabaseServiceRoleKey),
  });
  if (!response.ok) throw new Error(`Order lookup failed with status ${response.status}`);
  const orders = await response.json();
  return orders[0] || null;
};

const getRazorpayResource = async (config, path) => {
  const auth = Buffer.from(`${config.razorpayKeyId}:${config.razorpayKeySecret}`).toString('base64');
  const response = await fetch(`https://api.razorpay.com/v1/${path}`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!response.ok) return null;
  return response.json();
};

const getProduct = async (config, productId) => {
  const query = new URLSearchParams({
    id: `eq.${productId}`,
    active: 'eq.true',
    select: 'id,delivery_type,storage_path',
    limit: '1',
  });
  const response = await fetch(`${config.supabaseUrl}/rest/v1/products?${query}`, {
    headers: supabaseHeaders(config.supabaseServiceRoleKey),
  });
  if (!response.ok) throw new Error(`Product lookup failed with status ${response.status}`);
  const products = await response.json();
  return products[0] || null;
};

const createAccessToken = (secret, orderId, productId) => createHmac('sha256', secret)
  .update(`product-access:${orderId}:${productId}`)
  .digest('base64url');

const hashAccessToken = (token) => createHash('sha256').update(token).digest('hex');

const markOrderPaid = async (config, payload, amount, currency, accessTokenHash) => {
  const response = await fetch(`${config.supabaseUrl}/rest/v1/rpc/mark_order_paid`, {
    method: 'POST',
    headers: supabaseHeaders(config.supabaseServiceRoleKey),
    body: JSON.stringify({
      p_order_id: payload.orderId,
      p_razorpay_order_id: payload.razorpayOrderId,
      p_razorpay_payment_id: payload.razorpayPaymentId,
      p_amount: amount,
      p_currency: currency,
      p_access_token_hash: accessTokenHash,
    }),
  });
  const result = await response.json().catch(() => ({}));
  return { response, result };
};

export default async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: responseHeaders });
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Request body must be valid JSON.' }, 400);
  }

  const payload = validateRequest(body);
  if (payload.error) return jsonResponse({ error: payload.error }, 400);

  const config = getConfig();
  if (!config.razorpayKeyId || !config.razorpayKeySecret) {
    return jsonResponse({ error: 'Payment verification is not configured yet.' }, 503);
  }

  const hasOrderStorage = config.supabaseUrl && config.supabaseServiceRoleKey && config.accessTokenSecret;
  if (!hasOrderStorage) {
    if (!signatureMatches(config.razorpayKeySecret, payload.razorpayOrderId, payload.razorpayPaymentId, payload.razorpaySignature)) {
      return jsonResponse({ error: 'Payment signature verification failed.' }, 400);
    }

    return jsonResponse({
      verified: true,
      status: 'PAID',
      paymentId: payload.razorpayPaymentId,
      localMode: true,
    });
  }

  let storedOrder;
  try {
    storedOrder = await getStoredOrder(config, payload.orderId);
  } catch (error) {
    console.error(error);
    return jsonResponse({ error: 'The order could not be verified.' }, 502);
  }

  if (!storedOrder) return jsonResponse({ error: 'Order not found.' }, 404);
  if (storedOrder.razorpay_order_id !== payload.razorpayOrderId) {
    return jsonResponse({ error: 'Payment does not belong to this order.' }, 400);
  }
  if (!signatureMatches(config.razorpayKeySecret, payload.razorpayOrderId, payload.razorpayPaymentId, payload.razorpaySignature)) {
    return jsonResponse({ error: 'Payment signature verification failed.' }, 400);
  }

  const accessToken = createAccessToken(config.accessTokenSecret, storedOrder.id, storedOrder.product_id);
  const accessTokenHash = hashAccessToken(accessToken);
  let product;
  try {
    product = await getProduct(config, storedOrder.product_id);
  } catch (error) {
    console.error('Product fulfillment lookup failed:', error);
    return jsonResponse({ error: 'The purchased product could not be prepared for access.' }, 502);
  }
  if (!product) return jsonResponse({ error: 'The purchased product is no longer available.' }, 409);

  if (storedOrder.status === 'PAID') {
    if (storedOrder.razorpay_payment_id === payload.razorpayPaymentId) {
      let ensured;
      try {
        ensured = await markOrderPaid(
          config,
          payload,
          Math.round(Number(storedOrder.product_price) * 100),
          storedOrder.product_currency,
          accessTokenHash,
        );
      } catch (error) {
        console.error('Paid order access record update failed:', error);
        return jsonResponse({ error: 'Payment was already verified but product access could not be prepared.' }, 502);
      }
      if (!ensured.response.ok) {
        return jsonResponse({ error: 'Payment was already verified but product access could not be prepared.' }, 409);
      }
      return jsonResponse({
        verified: true,
        alreadyProcessed: true,
        orderId: storedOrder.id,
        status: 'PAID',
        paymentId: payload.razorpayPaymentId,
        accessUrl: `/api/access?token=${encodeURIComponent(accessToken)}`,
        deliveryType: product.delivery_type || 'pdf',
      });
    }
    return jsonResponse({ error: 'This order has already been processed.' }, 409);
  }
  if (storedOrder.status !== 'PENDING_PAYMENT') return jsonResponse({ error: 'This order is not awaiting payment.' }, 409);

  let razorpayOrder;
  let razorpayPayment;
  try {
    [razorpayOrder, razorpayPayment] = await Promise.all([
      getRazorpayResource(config, `orders/${encodeURIComponent(payload.razorpayOrderId)}`),
      getRazorpayResource(config, `payments/${encodeURIComponent(payload.razorpayPaymentId)}`),
    ]);
  } catch (error) {
    console.error('Razorpay verification lookup failed:', error);
    return jsonResponse({ error: 'Payment verification is temporarily unavailable.' }, 502);
  }

  const expectedAmount = Math.round(Number(storedOrder.product_price) * 100);
  const paymentMatchesOrder = razorpayPayment?.order_id === storedOrder.razorpay_order_id;
  const amountMatches = razorpayOrder?.amount === expectedAmount
    && razorpayPayment?.amount === expectedAmount;
  const currencyMatches = String(razorpayOrder?.currency || '').toUpperCase() === storedOrder.product_currency
    && String(razorpayPayment?.currency || '').toUpperCase() === storedOrder.product_currency;
  const notesMatch = !razorpayOrder?.notes
    || (!razorpayOrder.notes.internal_order_id || razorpayOrder.notes.internal_order_id === storedOrder.id)
      && (!razorpayOrder.notes.product_id || razorpayOrder.notes.product_id === storedOrder.product_id);

  if (!razorpayOrder || razorpayOrder.id !== storedOrder.razorpay_order_id || !razorpayPayment) {
    return jsonResponse({ error: 'Razorpay payment details could not be found.' }, 400);
  }
  if (!paymentMatchesOrder || !amountMatches || !currencyMatches || !notesMatch) {
    return jsonResponse({ error: 'Payment details do not match the order.' }, 400);
  }
  if (razorpayPayment.status !== 'captured') {
    return jsonResponse({ error: 'Payment has not been captured. The order remains PENDING_PAYMENT.' }, 409);
  }

  let marked;
  try {
    marked = await markOrderPaid(config, payload, razorpayPayment.amount, razorpayPayment.currency, accessTokenHash);
  } catch (error) {
    console.error('Order payment update failed:', error);
    return jsonResponse({ error: 'Payment was verified but the order could not be updated.' }, 502);
  }

  if (!marked.response.ok) {
    console.error('Order payment update returned status:', marked.response.status);
    return jsonResponse({ error: 'Payment was verified but the order could not be updated.' }, 409);
  }

  return jsonResponse({
    verified: true,
    alreadyProcessed: Boolean(marked.result?.already_processed),
    orderId: payload.orderId,
    status: 'PAID',
    paymentId: payload.razorpayPaymentId,
    accessUrl: `/api/access?token=${encodeURIComponent(accessToken)}`,
    deliveryType: product.delivery_type || 'pdf',
  });
};
