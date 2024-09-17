const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('Setting up proxy middleware');
  app.use(
    '/api/anthropic',
    createProxyMiddleware({
      target: 'https://api.anthropic.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/anthropic': '/v1',
      },
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request:', {
          method: req.method,
          path: req.path,
          targetUrl: proxyReq.path
        });
        // Log request body if it exists
        if (req.body) {
          console.log('Request body:', req.body);
        }
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('Received response:', {
          status: proxyRes.statusCode,
          headers: proxyRes.headers
        });
        let body = '';
        proxyRes.on('data', function (chunk) {
          body += chunk;
        });
        proxyRes.on('end', function () {
          console.log('Response body:', body);
        });
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end('Something went wrong with the proxy. Please check the server logs.');
      }
    })
  );
};