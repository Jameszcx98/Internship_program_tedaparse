const upload = require('./upload.js') // 自定义路由
const restful = require('./magentoRestful.js') // magento 路由
const user = require('./user.js')
const routes = {
  upload,
  restful,
  user
}
module.exports = app => {
  app.all('*', (req, res, next) => {
    console.log(req.method)
    if (req.method === 'POST') {
      console.log(req.body.locale, 'post')
      global.locale = req.body.locale
    } else {
      global.locale = req.query.locale || req.params.locale
    }
    next()
  })

  // 添加路由
  for (const key in routes) {
    app.use(`/${key}`, routes[key])
  }
}