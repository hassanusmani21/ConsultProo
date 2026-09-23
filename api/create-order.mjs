import createOrder from '../netlify/functions/create-order.mjs';
import { createVercelHandler } from '../lib/vercel-handler.mjs';

const handleCreateOrder = createVercelHandler(createOrder);

export default function handler(request, response) {
  handleCreateOrder(request, response);
}
