import { Buffer } from 'node:buffer';

const readRequestBody = async (request) => {
  if (request.body !== undefined) {
    if (typeof request.body === 'string') return request.body;
    if (Buffer.isBuffer(request.body)) return request.body.toString('utf8');
    return JSON.stringify(request.body);
  }

  const chunks = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
};

const runHandler = async (webHandler, request, response) => {
  const body = ['GET', 'HEAD'].includes(request.method) ? undefined : await readRequestBody(request);
  const headers = new Headers(request.headers);
  const url = new URL(request.url || '/', `https://${request.headers.host || 'localhost'}`).toString();
  const webRequest = new Request(url, {
    method: request.method,
    headers,
    body: body || undefined,
  });

  const webResponse = await webHandler(webRequest);
  response.statusCode = webResponse.status;
  webResponse.headers.forEach((value, key) => response.setHeader(key, value));
  response.end(Buffer.from(await webResponse.arrayBuffer()));
};

export const createVercelHandler = (webHandler) => (request, response) => {
  void runHandler(webHandler, request, response).catch((error) => {
    console.error('Vercel API handler failed:', error);
    if (response.headersSent) return;
    response.statusCode = 500;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ error: 'Internal server error.' }));
  });
};
