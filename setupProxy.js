// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.anthropic.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/v1', // Rewrite path to match the API endpoint
      },
      onProxyReq: (proxyReq, req, res) => {
        // Log the proxy request for debugging
        console.log('Proxy request:', req.method, req.path);
        console.log('Proxy request headers:', proxyReq.getHeaders());
      },
      onProxyRes: (proxyRes, req, res) => {
        // Log the proxy response for debugging
        console.log('Proxy response:', proxyRes.statusCode);
        console.log('Proxy response headers:', proxyRes.headers);
      },
    })
  );
};
