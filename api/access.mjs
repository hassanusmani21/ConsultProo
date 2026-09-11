import accessProduct from '../netlify/functions/access-product.mjs';
import { createVercelHandler } from '../lib/vercel-handler.mjs';

export default createVercelHandler(accessProduct);
