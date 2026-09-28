import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const responseHeaders = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: responseHeaders });

const getConfig = () => ({
  supabaseUrl: process.env.SUPABASE_URL?.replace(/\/$/, ''),
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY,
});

const serviceHeaders = (key) => ({ apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' });
const accessToken = (request) => {
  const header = request.headers.get('authorization') || '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : '';
};

const requireAdmin = async (config, request) => {
  const token = accessToken(request);
  if (!token) return { error: 'Authentication is required.', status: 401 };
  const authClient = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: { user }, error } = await authClient.auth.getUser(token);
  if (error || !user) return { error: 'Your admin session has expired. Please sign in again.', status: 401 };
  const query = new URLSearchParams({ user_id: `eq.${user.id}`, select: 'user_id', limit: '1' });
  const membership = await fetch(`${config.supabaseUrl}/rest/v1/admin_users?${query}`, { headers: serviceHeaders(config.supabaseServiceRoleKey) });
  if (!membership.ok) throw new Error(`Admin membership lookup failed with status ${membership.status}`);
  if (!(await membership.json())[0]) return { error: 'This account is not approved for admin access.', status: 403 };
  return { user };
};

const ensureBucket = async (config, id, isPublic, fileSizeLimit) => {
  // Buckets are provisioned by supabase/schema.sql. Check first so an upload
  // never fails merely because the bucket already exists (Storage can report
  // that condition as HTTP 400 on some project/API versions).
  const existing = await fetch(`${config.supabaseUrl}/storage/v1/bucket/${encodeURIComponent(id)}`, {
    headers: serviceHeaders(config.supabaseServiceRoleKey),
  });
  if (existing.ok) return;
  if (existing.status !== 404) {
    const detail = await existing.text();
    throw new Error(`Unable to check the ${id} storage bucket (${existing.status})${detail ? `: ${detail}` : ''}`);
  }

  const response = await fetch(`${config.supabaseUrl}/storage/v1/bucket`, {
    method: 'POST', headers: serviceHeaders(config.supabaseServiceRoleKey),
    body: JSON.stringify({ id, name: id, public: isPublic, file_size_limit: fileSizeLimit }),
  });
  if (response.ok || response.status === 409) return;
  const detail = await response.text();
  // A concurrent request may have created it after the check above. Treat that
  // as success as well; the next signed-upload call is the real verification.
  if (response.status === 400 && /already exists|duplicate/i.test(detail)) return;
  throw new Error(`Unable to create the ${id} storage bucket (${response.status})${detail ? `: ${detail}` : ''}`);
};

const safeSegment = (value, fallback) => String(value || fallback).replace(/[^A-Za-z0-9._-]/g, '-').replace(/-+/g, '-').slice(0, 160) || fallback;
const safeExtension = (fileName) => String(fileName || '').split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12) || 'bin';

const uploadLocation = ({ kind, collection, itemId, fileName }) => {
  if (kind === 'product') {
    const folders = { ebooks: 'ebooks', villaPlans: 'villa-plans', aiPrompts: 'prompts', digitalProducts: 'courses' };
    const folder = folders[collection];
    return folder ? { bucket: 'product-files', path: `${folder}/${safeSegment(itemId, randomUUID())}.${safeExtension(fileName)}` } : null;
  }
  if (kind !== 'asset') return null;
  const folder = collection === 'profile' ? 'cms/profile' : `cms/${safeSegment(collection, 'assets')}`;
  const filename = `${randomUUID()}-${safeSegment(fileName, 'asset')}`;
  return { bucket: 'cms-assets', path: `${folder}/${filename}`, publicUrl: (url) => `${url}/storage/v1/object/public/cms-assets/${encodeURIComponent(folder).replace(/%2F/g, '/')}/${encodeURIComponent(filename)}` };
};

export default async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: responseHeaders });
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405);
  const config = getConfig();
  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) return jsonResponse({ error: 'Upload storage is not configured on the server.' }, 503);

  try {
    const authorization = await requireAdmin(config, request);
    if (authorization.error) return jsonResponse({ error: authorization.error }, authorization.status);
    const payload = await request.json();
    const kind = payload?.kind;
    const fileSize = Number(payload?.fileSize);
    const location = uploadLocation({ kind, collection: payload?.collection, itemId: payload?.itemId, fileName: payload?.fileName });
    const maxSize = kind === 'product' ? 100 * 1024 * 1024 : 3 * 1024 * 1024;
    if (!location || !Number.isFinite(fileSize) || fileSize < 1 || fileSize > maxSize) return jsonResponse({ error: 'This upload request is invalid or exceeds the allowed file size.' }, 400);
    // Only touch the bucket required for this upload. An image upload must not
    // depend on the separate private product-download bucket, or vice versa.
    await ensureBucket(config, location.bucket, location.bucket === 'cms-assets', maxSize);
    const storage = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
    const { data, error } = await storage.storage.from(location.bucket).createSignedUploadUrl(location.path, { upsert: true });
    if (error || !data?.token) throw new Error(error?.message || 'Storage did not create an upload URL.');
    return jsonResponse({ bucket: location.bucket, path: location.path, token: data.token, publicUrl: location.publicUrl?.(config.supabaseUrl) || null });
  } catch (error) {
    console.error('Admin upload URL failed:', error);
    return jsonResponse({ error: error instanceof Error ? error.message : 'Upload setup failed.' }, 500);
  }
};
