import adminUploadUrl from '../netlify/functions/admin-upload-url.mjs';
import { createVercelHandler } from '../lib/vercel-handler.mjs';

const handleAdminUploadUrl = createVercelHandler(adminUploadUrl);

export default function handler(request, response) {
  handleAdminUploadUrl(request, response);
}
