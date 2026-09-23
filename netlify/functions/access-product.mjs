import { createHash } from 'node:crypto';

const jsonResponse = (body, status = 400) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  },
});

const supabaseHeaders = (serviceRoleKey) => ({
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  'Content-Type': 'application/json',
});

const getConfig = () => ({
  supabaseUrl: process.env.SUPABASE_URL?.replace(/\/$/, ''),
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  storageBucket: process.env.PRODUCT_STORAGE_BUCKET || 'product-files',
});

const getAccessRecord = async (config, tokenHash) => {
  const query = new URLSearchParams({
    token_hash: `eq.${tokenHash}`,
    revoked: 'eq.false',
    select: 'id,order_id,customer_id,product_id',
    limit: '1',
  });
  const response = await fetch(`${config.supabaseUrl}/rest/v1/product_access?${query}`, {
    headers: supabaseHeaders(config.supabaseServiceRoleKey),
  });
  if (!response.ok) throw new Error(`Access lookup failed with status ${response.status}`);
  const records = await response.json();
  return records[0] || null;
};

const getOrder = async (config, orderId) => {
  const query = new URLSearchParams({
    id: `eq.${orderId}`,
    select: 'id,status,customer_id,product_id,product_name,product_storage_path,product_delivery_type',
    limit: '1',
  });
  const response = await fetch(`${config.supabaseUrl}/rest/v1/orders?${query}`, {
    headers: supabaseHeaders(config.supabaseServiceRoleKey),
  });
  if (!response.ok) throw new Error(`Order lookup failed with status ${response.status}`);
  const orders = await response.json();
  return orders[0] || null;
};

const getProduct = async (config, order) => {
  const query = new URLSearchParams({
    id: `eq.${order.product_id}`,
    select: 'id,storage_path,delivery_type',
    limit: '1',
  });
  const response = await fetch(`${config.supabaseUrl}/rest/v1/products?${query}`, {
    headers: supabaseHeaders(config.supabaseServiceRoleKey),
  });
  if (!response.ok) throw new Error(`Product lookup failed with status ${response.status}`);
  const products = await response.json();
  const currentProduct = products[0];
  if (!currentProduct && !order.product_storage_path) return null;
  return {
    id: order.product_id,
    storage_path: order.product_storage_path || currentProduct?.storage_path,
    delivery_type: order.product_delivery_type || currentProduct?.delivery_type || 'pdf',
  };
};

const getCmsProduct = async (config, collection, productId) => {
  const query = new URLSearchParams({
    collection: `eq.${collection}`,
    item_id: `eq.${productId}`,
    published: 'eq.true',
    select: 'collection,item_id,data,published',
    limit: '1',
  });
  const response = await fetch(`${config.supabaseUrl}/rest/v1/cms_content?${query}`, {
    headers: supabaseHeaders(config.supabaseServiceRoleKey),
  });
  if (!response.ok) throw new Error(`CMS product lookup failed with status ${response.status}`);
  const records = await response.json();
  return records[0]?.data || null;
};

const isFreeCmsProduct = (collection, product) => {
  if (!product || product.published === false) return false;
  if (collection === 'aiPrompts') return String(product.type || '').toUpperCase() === 'FREE';
  if (String(product.badge || '').toUpperCase() === 'FREE') return true;

  const price = Number(String(product.price ?? '').replace(/[^0-9.-]/g, ''));
  return !Number.isFinite(price) || price <= 0;
};

const getCmsStoragePath = (product) => (
  product?.storagePath || product?.pdfStoragePath || product?.pdfUrl || ''
);

const extensionFromPath = (path) => {
  const pathname = (() => {
    try { return new URL(path).pathname; } catch { return path; }
  })();
  const match = pathname.match(/\.([A-Za-z0-9]{1,10})(?:$|[?#])/);
  return match ? match[1].toLowerCase() : 'pdf';
};

const downloadFilename = (name, storagePath) => {
  const extension = extensionFromPath(storagePath);
  const base = String(name || storagePath.split('/').pop() || 'download')
    .replace(/\.[A-Za-z0-9]{1,10}$/i, '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9._ -]+/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120) || 'download';
  return `${base}.${extension}`;
};

const contentDisposition = (filename) => {
  const fallback = filename.replace(/["\\]/g, '').replace(/[^\x20-\x7E]/g, '_');
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
};

const updateLastAccessed = async (config, accessId) => {
  const query = new URLSearchParams({ id: `eq.${accessId}` });
  await fetch(`${config.supabaseUrl}/rest/v1/product_access?${query}`, {
    method: 'PATCH',
    headers: { ...supabaseHeaders(config.supabaseServiceRoleKey), Prefer: 'return=minimal' },
    body: JSON.stringify({ last_accessed_at: new Date().toISOString() }),
  });
};

const getSignedUrl = async (config, storagePath) => {
  const encodedPath = storagePath.split('/').map(encodeURIComponent).join('/');
  const response = await fetch(
    `${config.supabaseUrl}/storage/v1/object/sign/${encodeURIComponent(config.storageBucket)}/${encodedPath}`,
    {
      method: 'POST',
      headers: supabaseHeaders(config.supabaseServiceRoleKey),
      body: JSON.stringify({ expiresIn: 300 }),
    },
  );
  if (!response.ok) throw new Error(`Storage signing failed with status ${response.status}`);
  const result = await response.json();
  if (!result.signedURL) throw new Error('Storage did not return a signed URL.');
  return result.signedURL.startsWith('http')
    ? result.signedURL
    : `${config.supabaseUrl}/storage/v1${result.signedURL}`;
};

const downloadResponse = async (url, filename) => {
  const fileResponse = await fetch(url, { redirect: 'follow' });
  if (!fileResponse.ok || !fileResponse.body) {
    throw new Error(`File download failed with status ${fileResponse.status}`);
  }

  const sourceContentType = fileResponse.headers.get('Content-Type') || 'application/octet-stream';
  const headers = new Headers({
    'Content-Disposition': contentDisposition(filename),
    'Content-Type': 'application/octet-stream',
    'X-Original-Content-Type': sourceContentType,
    'Cache-Control': 'no-store, private',
    'X-Content-Type-Options': 'nosniff',
  });

  const contentLength = fileResponse.headers.get('Content-Length');
  if (contentLength) headers.set('Content-Length', contentLength);

  return new Response(fileResponse.body, {
    status: 200,
    headers,
  });
};

export default async (request) => {
  if (request.method !== 'GET') return jsonResponse({ error: 'Method not allowed.' }, 405);

  const config = getConfig();
  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
    return jsonResponse({ error: 'Product access is not configured yet.' }, 503);
  }

  const url = new URL(request.url);
  const token = url.searchParams.get('token') || '';
  const collection = url.searchParams.get('collection') || '';
  const productId = url.searchParams.get('id') || '';

  try {
    if (!token && collection && productId) {
      if (!['ebooks', 'villaPlans', 'aiPrompts', 'digitalProducts'].includes(collection)) {
        return jsonResponse({ error: 'This free resource is not available.' }, 404);
      }
      if (!/^[A-Za-z0-9._:-]{1,160}$/.test(productId)) {
        return jsonResponse({ error: 'This free resource link is invalid.' }, 404);
      }

      const product = await getCmsProduct(config, collection, productId);
      if (!isFreeCmsProduct(collection, product)) {
        return jsonResponse({ error: 'This resource requires checkout.' }, 403);
      }

      const storagePath = getCmsStoragePath(product).trim();
      if (!storagePath) return jsonResponse({ error: 'The free file is not available yet.' }, 404);

      const signedUrl = /^https?:\/\//i.test(storagePath)
        ? storagePath
        : await getSignedUrl(config, storagePath);

      return downloadResponse(signedUrl, downloadFilename(product.title || product.name || productId, storagePath));
    }

    if (!config.accessTokenSecret) return jsonResponse({ error: 'Product access is not configured yet.' }, 503);
    if (!/^[A-Za-z0-9_-]{40,200}$/.test(token)) return jsonResponse({ error: 'This access link is invalid or expired.' }, 404);

    const tokenHash = createHash('sha256').update(token).digest('hex');
    const access = await getAccessRecord(config, tokenHash);
    if (!access) return jsonResponse({ error: 'This access link is invalid or expired.' }, 404);

    const order = await getOrder(config, access.order_id);
    if (!order || order.status !== 'PAID' || order.customer_id !== access.customer_id || order.product_id !== access.product_id) {
      return jsonResponse({ error: 'This product is not available through this access link.' }, 403);
    }

    const product = await getProduct(config, order);
    if (!product?.storage_path) return jsonResponse({ error: 'The purchased file is not available yet.' }, 404);

    const signedUrl = await getSignedUrl(config, product.storage_path);
    await updateLastAccessed(config, access.id);

    return downloadResponse(signedUrl, downloadFilename(order.product_name || product.id, product.storage_path));
  } catch (error) {
    console.error('Protected product access failed:', error);
    return jsonResponse({ error: 'Product access is temporarily unavailable.' }, 502);
  }
};
