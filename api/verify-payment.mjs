import verifyPayment from '../netlify/functions/verify-payment.mjs';
import { createVercelHandler } from '../lib/vercel-handler.mjs';

const handleVerifyPayment = createVercelHandler(verifyPayment);

export default function handler(request, response) {
  handleVerifyPayment(request, response);
}
