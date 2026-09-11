import verifyPayment from '../netlify/functions/verify-payment.mjs';
import { createVercelHandler } from '../lib/vercel-handler.mjs';

export default createVercelHandler(verifyPayment);
