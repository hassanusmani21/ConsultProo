import accessProduct from '../netlify/functions/access-product.mjs';
import { createVercelHandler } from '../lib/vercel-handler.mjs';

const handleAccessProduct = createVercelHandler(accessProduct);

export default function handler(request, response) {
  handleAccessProduct(request, response);
}
