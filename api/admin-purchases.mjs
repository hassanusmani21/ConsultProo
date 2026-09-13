import adminPurchases from '../netlify/functions/admin-purchases.mjs';
import { createVercelHandler } from '../lib/vercel-handler.mjs';

const handleAdminPurchases = createVercelHandler(adminPurchases);

export default function handler(request, response) {
  handleAdminPurchases(request, response);
}
