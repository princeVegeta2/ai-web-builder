// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/together',
    createProxyMiddleware({
      target: 'https://api.together.ai',
      changeOrigin: true,
      pathRewrite: {
        '^/api/together': '/v1', // rewrite path
      },
      logLevel: 'debug',
    })
  );
};
