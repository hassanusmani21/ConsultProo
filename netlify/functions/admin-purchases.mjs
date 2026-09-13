import { randomUUID } from 'node:crypto';
import { Buffer } from 'node:buffer';
import { createClient } from '@supabase/supabase-js';

const responseHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};

const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: responseHeaders,
});

const getConfig = () => ({
  supabaseUrl: process.env.SUPABASE_URL?.replace(/\/$/, ''),
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
});

const supabaseHeaders = (serviceRoleKey) => ({
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  'Content-Type': 'application/json',
});

const getAccessToken = (request) => {
  const header = request.headers.get('authorization') || '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : '';
};

const restRequest = async (config, path, options = {}) => fetch(`${config.supabaseUrl}/rest/v1/${path}`, {
  ...options,
  headers: {
    ...supabaseHeaders(config.supabaseServiceRoleKey),
    ...(options.headers || {}),
  },
});

const requireAdmin = async (config, request) => {
  const accessToken = getAccessToken(request);
  if (!accessToken) return { error: 'Authentication is required.', status: 401 };

  const authClient = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: { user }, error: userError } = await authClient.auth.getUser(accessToken);
  if (userError || !user) return { error: 'Your admin session has expired. Please sign in again.', status: 401 };

  const query = new URLSearchParams({
    user_id: `eq.${user.id}`,
    select: 'user_id',
    limit: '1',
  });
  const membershipResponse = await restRequest(config, `admin_users?${query}`);
  if (!membershipResponse.ok) throw new Error(`Admin membership lookup failed with status ${membershipResponse.status}`);
  const membership = await membershipResponse.json();
  if (!membership[0]) return { error: 'This account is not approved for admin access.', status: 403 };

  return { user };
};

const getOrders = async (config) => {
  const query = new URLSearchParams({
    select: 'id,status,product_id,product_name,product_price,product_currency,customer_id,razorpay_order_id,razorpay_payment_id,paid_at,client_order_id,created_at,customer:customers(full_name,email,phone,country,country_code)',
    order: 'created_at.desc',
    limit: '1000',
  });
  const response = await restRequest(config, `orders?${query}`);
  if (!response.ok) throw new Error(`Purchase lookup failed with status ${response.status}`);
  return response.json();
};

const razorpayRequest = async (config, path) => {
  const auth = Buffer.from(`${config.razorpayKeyId}:${config.razorpayKeySecret}`).toString('base64');
  const response = await fetch(`https://api.razorpay.com/v1/${path}`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!response.ok) throw new Error(`Razorpay request failed with status ${response.status}`);
  return response.json();
};

const getProducts = async (config, productIds) => {
  const products = new Map();
  await Promise.all([...productIds].map(async (productId) => {
    const query = new URLSearchParams({ id: `eq.${productId}`, select: 'id,name,price,currency,storage_path,delivery_type', limit: '1' });
    const response = await restRequest(config, `products?${query}`);
    if (!response.ok) return;
    const rows = await response.json();
    if (rows[0]) products.set(productId, rows[0]);
  }));
  return products;
};

const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value || '');

const normalizePhone = (value) => {
  const phone = String(value || '').replace(/[^+\d]/g, '');
  return phone.length >= 8 && phone.length <= 20 ? phone : '0000000000';
};

const normalizeName = (payment, notes) => {
  const candidate = notes.customer_name || notes.name || payment.email?.split('@')[0] || 'Razorpay customer';
  return String(candidate).trim().slice(0, 100) || 'Razorpay customer';
};

const syncRazorpayPayments = async (config, existingOrders) => {
  if (!config.razorpayKeyId || !config.razorpayKeySecret) {
    return { synced: 0, warnings: ['Razorpay server credentials are not configured.'] };
  }

  const paymentResult = await razorpayRequest(config, 'payments?count=100');
  const capturedPayments = (paymentResult.items || []).filter((payment) => payment.status === 'captured');
  const ordersByPayment = new Map(existingOrders.filter((order) => order.razorpay_payment_id).map((order) => [order.razorpay_payment_id, order]));
  const ordersByRazorpayId = new Map(existingOrders.filter((order) => order.razorpay_order_id).map((order) => [order.razorpay_order_id, order]));
  const ordersById = new Map(existingOrders.map((order) => [order.id, order]));
  const remoteOrders = new Map();
  const remoteOrderIds = [...new Set(capturedPayments.map((payment) => payment.order_id).filter(Boolean))];

  await Promise.all(remoteOrderIds.map(async (orderId) => {
    try {
      remoteOrders.set(orderId, await razorpayRequest(config, `orders/${encodeURIComponent(orderId)}`));
    } catch {
      // The payment itself is still usable for import if Razorpay does not return the order.
    }
  }));

  const notesByPayment = capturedPayments.map((payment) => ({
    payment,
    notes: { ...(remoteOrders.get(payment.order_id)?.notes || {}), ...(payment.notes || {}) },
  }));
  const productIds = new Set(notesByPayment.map(({ notes }) => notes.product_id).filter(Boolean));
  const products = await getProducts(config, productIds);
  const warnings = [];
  let synced = 0;

  for (const { payment, notes } of notesByPayment) {
    if (ordersByPayment.has(payment.id)) continue;

    const existingOrder = ordersByRazorpayId.get(payment.order_id)
      || (isUuid(notes.internal_order_id) ? ordersById.get(notes.internal_order_id) : null);
    const paidAt = payment.created_at ? new Date(payment.created_at * 1000).toISOString() : new Date().toISOString();

    if (existingOrder) {
      const query = new URLSearchParams({ id: `eq.${existingOrder.id}` });
      const response = await restRequest(config, `orders?${query}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'PAID', razorpay_payment_id: payment.id, paid_at: paidAt }),
        headers: { Prefer: 'return=minimal' },
      });
      if (!response.ok) warnings.push(`Could not update order ${existingOrder.id}.`);
      else synced += 1;
      continue;
    }

    try {
      const email = String(payment.email || `razorpay-${payment.id}@import.invalid`).trim().toLowerCase().slice(0, 254);
      const customerResponse = await restRequest(config, 'customers', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({
          full_name: normalizeName(payment, notes),
          email,
          country_code: String(notes.country_code || 'IN').slice(0, 16),
          country: String(notes.country || 'India').slice(0, 100),
          phone: normalizePhone(payment.contact),
        }),
      });
      if (!customerResponse.ok) throw new Error('customer could not be stored');
      const customers = await customerResponse.json();
      const customer = customers[0];
      if (!customer?.id) throw new Error('customer ID was not returned');

      const productId = String(notes.product_id || `razorpay-import-${payment.id}`).slice(0, 200);
      const product = products.get(notes.product_id);
      const orderId = isUuid(notes.internal_order_id) ? notes.internal_order_id : randomUUID();
      const orderResponse = await restRequest(config, 'orders', {
        method: 'POST',
        headers: { Prefer: 'return=representation,resolution=ignore-duplicates' },
        body: JSON.stringify({
          id: orderId,
          product_id: productId,
          product_name: product?.name || remoteOrders.get(payment.order_id)?.description || 'Imported Razorpay payment',
          product_price: product?.price || Number(payment.amount || 0) / 100,
          product_currency: product?.currency || payment.currency || 'INR',
          product_storage_path: product?.storage_path || null,
          product_delivery_type: product?.delivery_type || 'pdf',
          customer_id: customer.id,
          razorpay_order_id: payment.order_id || null,
          razorpay_payment_id: payment.id,
          status: 'PAID',
          paid_at: paidAt,
          client_order_id: `razorpay-import-${payment.id}`,
        }),
      });
      if (!orderResponse.ok) throw new Error('order could not be stored');
      synced += 1;
    } catch (error) {
      warnings.push(`Payment ${payment.id} was not imported: ${error instanceof Error ? error.message : 'unknown error'}.`);
    }
  }

  return { synced, warnings: warnings.slice(0, 10) };
};

export default async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: responseHeaders });
  if (request.method !== 'GET') return jsonResponse({ error: 'Method not allowed.' }, 405);

  const config = getConfig();
  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
    return jsonResponse({ error: 'Purchase storage is not configured on the server.' }, 503);
  }

  try {
    const authorization = await requireAdmin(config, request);
    if (authorization.error) return jsonResponse({ error: authorization.error }, authorization.status);

    let purchases = await getOrders(config);
    const shouldSync = new URL(request.url).searchParams.get('sync') === '1';
    const sync = shouldSync
      ? await syncRazorpayPayments(config, purchases)
      : { synced: 0, warnings: [] };

    if (shouldSync && sync.synced > 0) purchases = await getOrders(config);
    return jsonResponse({ purchases, ...sync });
  } catch (error) {
    console.error('Admin purchases request failed:', error);
    return jsonResponse({ error: error instanceof Error ? error.message : 'Purchases could not be loaded.' }, 500);
  }
};

