const express = require('express')
const router = express.Router()
const wechatConfig = require('../config')
const request = require('../tools/request')

// https://github.com/fabacus/node-magento2  已经有包了....

router.use(function timelog(req, res, next) {
  // console.log( '请求MagentoAPI:' , Date.now())
  next()
})


router.get('/getOpenId', (req, res) => {
  
  const q = req.query
  const appId = wechatConfig.WechatAppID
  const secret = wechatConfig.WechatAppSecret

 request.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
          //小程序唯一标识
          appid: appId,//小程序的 app secret
          secret: secret,
          grant_type: 'authorization_code',
          js_code: q.code
      }
  }).then(result => {
    res.end(result)
  }).catch(e => {
    res.end(e)
  })

})

module.exports = router