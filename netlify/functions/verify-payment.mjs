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
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  appUrl: process.env.APP_URL?.replace(/\/$/, ''),
  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM,
  supportEmail: process.env.SUPPORT_EMAIL,
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
    select: 'id,status,product_id,product_name,product_price,product_currency,customer_id,razorpay_order_id,razorpay_payment_id',
    limit: '1',
  });
  const response = await fetch(`${config.supabaseUrl}/rest/v1/orders?${query}`, {
    headers: supabaseHeaders(config.supabaseServiceRoleKey),
  });
  if (!response.ok) throw new Error(`Order lookup failed with status ${response.status}`);
  const orders = await response.json();
  return orders[0] || null;
};

const getCustomer = async (config, customerId) => {
  const query = new URLSearchParams({
    id: `eq.${customerId}`,
    select: 'full_name,email',
    limit: '1',
  });
  const response = await fetch(`${config.supabaseUrl}/rest/v1/customers?${query}`, {
    headers: supabaseHeaders(config.supabaseServiceRoleKey),
  });
  if (!response.ok) throw new Error(`Customer lookup failed with status ${response.status}`);
  const customers = await response.json();
  return customers[0] || null;
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

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const sendPurchaseConfirmation = async (request, config, order, customer, accessToken, paymentId) => {
  if (!config.resendApiKey || !config.emailFrom || !config.supportEmail || !customer?.email) {
    return { sent: false, skipped: true };
  }

  const appUrl = config.appUrl || new URL(request.url).origin;
  const accessUrl = `${appUrl}/api/access?token=${encodeURIComponent(accessToken)}`;
  const customerName = customer.full_name || 'there';
  const productName = order.product_name || 'your purchase';
  const orderId = order.id;
  const supportEmail = config.supportEmail;
  const escapedAccessUrl = escapeHtml(accessUrl);
  const escapedCustomerName = escapeHtml(customerName);
  const escapedProductName = escapeHtml(productName);
  const escapedOrderId = escapeHtml(orderId);
  const escapedSupportEmail = escapeHtml(supportEmail);

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f5f4ef;color:#12141a;font-family:Arial,Helvetica,sans-serif;line-height:1.5;">
    <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
      <div style="background:#ffffff;border:1px solid #e3e0d8;border-radius:16px;padding:32px 24px;">
        <p style="margin:0 0 12px;color:#9e825d;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Purchase confirmed</p>
        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">Thank you, ${escapedCustomerName}.</h1>
        <p style="margin:0 0 24px;color:#4a4d57;">Your payment was verified successfully and your order is confirmed.</p>
        <div style="border:1px solid #e3e0d8;border-radius:10px;background:#faf8f5;padding:16px;margin-bottom:24px;">
          <p style="margin:0 0 8px;"><strong>Product:</strong> ${escapedProductName}</p>
          <p style="margin:0;"><strong>Order ID:</strong> ${escapedOrderId}</p>
        </div>
        <p style="margin:0 0 24px;text-align:center;">
          <a href="${escapedAccessUrl}" style="display:inline-block;background:#12141a;border-radius:8px;color:#ffffff;padding:13px 20px;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:1px;">Access Your Product</a>
        </p>
        <p style="margin:0;color:#747783;font-size:13px;">Need help? Contact <a href="mailto:${escapedSupportEmail}" style="color:#9e825d;">${escapedSupportEmail}</a>.</p>
      </div>
    </div>
  </body>
</html>`;
  const text = `Purchase confirmed\n\nThank you, ${customerName}.\n\nProduct: ${productName}\nOrder ID: ${orderId}\n\nAccess Your Product: ${accessUrl}\n\nNeed help? Contact ${supportEmail}.`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.resendApiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `purchase-confirmation/${paymentId || order.razorpay_payment_id}`,
      },
      body: JSON.stringify({
        from: config.emailFrom,
        to: [customer.email],
        reply_to: supportEmail,
        subject: `Purchase confirmed: ${productName}`,
        html,
        text,
      }),
    });

    if (!response.ok) {
      console.error('Purchase confirmation email failed:', response.status);
      return { sent: false };
    }

    return { sent: true };
  } catch (error) {
    console.error('Purchase confirmation email request failed:', error);
    return { sent: false };
  }
};

const sendPurchaseConfirmationForOrder = async (request, config, order, accessToken, paymentId) => {
  try {
    const customer = await getCustomer(config, order.customer_id);
    return sendPurchaseConfirmation(request, config, order, customer, accessToken, paymentId);
  } catch (error) {
    console.error('Purchase confirmation customer lookup failed:', error);
    return { sent: false };
  }
};

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
    return jsonResponse({ error: 'Order storage is not configured. Payment cannot be verified yet.' }, 503);
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
      const email = await sendPurchaseConfirmationForOrder(request, config, storedOrder, accessToken, payload.razorpayPaymentId);
      return jsonResponse({
        verified: true,
        alreadyProcessed: true,
        orderId: storedOrder.id,
        status: 'PAID',
        paymentId: payload.razorpayPaymentId,
        productName: storedOrder.product_name,
        accessUrl: `/api/access?token=${encodeURIComponent(accessToken)}`,
        deliveryType: product.delivery_type || 'pdf',
        emailSent: email.sent,
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

  const email = await sendPurchaseConfirmationForOrder(request, config, storedOrder, accessToken, payload.razorpayPaymentId);

  return jsonResponse({
    verified: true,
    alreadyProcessed: Boolean(marked.result?.already_processed),
    orderId: payload.orderId,
    status: 'PAID',
    paymentId: payload.razorpayPaymentId,
    productName: storedOrder.product_name,
    accessUrl: `/api/access?token=${encodeURIComponent(accessToken)}`,
    deliveryType: product.delivery_type || 'pdf',
    emailSent: email.sent,
  });
};
