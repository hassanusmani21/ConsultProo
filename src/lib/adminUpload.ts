import { supabase, supabaseConfigurationMessage } from './supabase';

type UploadKind = 'asset' | 'product';

export const uploadAdminFile = async ({ kind, collection, itemId, file }: { kind: UploadKind; collection: string; itemId: string; file: File }) => {
  if (!supabase) throw new Error(supabaseConfigurationMessage);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Your admin session has expired. Please sign in again.');
  const response = await fetch('/api/admin-upload-url', {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind, collection, itemId, fileName: file.name, fileSize: file.size }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.bucket || !payload?.path || !payload?.token) throw new Error(payload?.error || 'Upload setup failed.');
  const { error } = await supabase.storage.from(payload.bucket).uploadToSignedUrl(payload.path, payload.token, file, { contentType: file.type || 'application/octet-stream' });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return kind === 'product' ? payload.path : payload.publicUrl;
};
