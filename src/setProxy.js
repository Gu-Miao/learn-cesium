/**
 * Set proxy for project, this usage is quite similar with exporess middleware,
 * if you are familiar with express that's not hard
 *
 * If you want more advanced useage,
 * visit https://create-react-app.dev/docs/proxying-api-requests-in-development/
 *
 * Official document of http-proxy-middleware:
 * https://github.com/chimurai/http-proxy-middleware
 *
 */
const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = app => {
  app.use(
    '/path/to/api',
    createProxyMiddleware({
      target: 'https://some.api.address',
      changeOrigin: true
    })
  )
}
