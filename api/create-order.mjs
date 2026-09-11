import createOrder from '../netlify/functions/create-order.mjs';
import { createVercelHandler } from '../lib/vercel-handler.mjs';

export default createVercelHandler(createOrder);
