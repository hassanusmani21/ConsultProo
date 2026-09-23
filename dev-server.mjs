import 'dotenv/config';
import express from 'express';
import net from 'node:net';
import { createServer as createViteServer } from 'vite';
import createOrder from './netlify/functions/create-order.mjs';
import verifyPayment from './netlify/functions/verify-payment.mjs';
import accessProduct from './netlify/functions/access-product.mjs';
import adminPurchases from './netlify/functions/admin-purchases.mjs';

const apiHandlers = {
  '/api/orders': createOrder,
  '/api/create-order': createOrder,
  '/api/verify-payment': verifyPayment,
  '/api/access': accessProduct,
  '/api/admin-purchases': adminPurchases,
};

const findAvailablePort = (startPort) => new Promise((resolve, reject) => {
  const probe = net.createServer();
  probe.once('error', (error) => {
    if (error.code !== 'EADDRINUSE') reject(error);
    else resolve(findAvailablePort(startPort + 1));
  });
  probe.once('listening', () => probe.close(() => resolve(startPort)));
  probe.listen(startPort, '0.0.0.0');
});

const toRequestHeaders = (headers) => Object.fromEntries(
  Object.entries(headers).flatMap(([key, value]) => (
    value == null ? [] : [[key, Array.isArray(value) ? value.join(', ') : value]]
  )),
);

const toWebRequest = (request) => {
  const hasBody = !['GET', 'HEAD'].includes(request.method);
  return new Request(`http://${request.headers.host || 'localhost'}${request.originalUrl}`, {
    method: request.method,
    headers: toRequestHeaders(request.headers),
    body: hasBody ? JSON.stringify(request.body ?? {}) : undefined,
  });
};

const forwardApiRequest = async (request, response, next) => {
  const handler = apiHandlers[request.path];
  if (!handler) return next();

  try {
    const apiResponse = await handler(toWebRequest(request));
    apiResponse.headers.forEach((value, key) => response.setHeader(key, value));
    response.status(apiResponse.status).send(await apiResponse.text());
  } catch (error) {
    console.error(`Local API request failed for ${request.path}:`, error);
    response.status(500).json({ error: 'The local API request failed.' });
  }
};

const start = async () => {
  const app = express();
  app.use(express.json());
  app.use(forwardApiRequest);

  const vite = await createViteServer({
    appType: 'spa',
    server: {
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  });
  app.use(vite.middlewares);

  const port = process.env.PORT ? Number(process.env.PORT) : await findAvailablePort(3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Local app running at http://localhost:${port}`);
  });
};

start().catch((error) => {
  console.error('Could not start the local app:', error);
  process.exitCode = 1;
});
