const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/together', // Existing proxy setup for third-party API
    createProxyMiddleware({
      target: 'https://api.together.ai',
      changeOrigin: true,
      pathRewrite: {
        '^/api/together': '/v1', // Rewrite path
      },
      logLevel: 'debug',
    })
  );
};
