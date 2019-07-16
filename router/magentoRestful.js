let express = require('express')
let router = express.Router()
const request = require('../tools/request')

// https://github.com/fabacus/node-magento2  已经有包了....

router.use(function timelog(req, res, next) {
  // console.log( '请求MagentoAPI:' , Date.now())
  next()
})


router.get('/categories', async (req, res) => {
  let r = await request.get('/categories').then()
  res.send(r)
})

router.post('/customers', (req, res) => {
  const id = req.body.id
  request({
    method: 'post',
    url: '/customers',
    data: {
      customer: {
        "email": `${id}_${Date.now()}@qq.com`,
        "firstname": "John",
        "lastname": "Doe",
        "storeId": 1,
        "websiteId": 1
      },
      password: id
    }
  })
  .then(result => res.end(result))
  .catch( e => {
    res.end(e)
  })
})

module.exports = router