
const WXBizDataCrypt = require('../tools/WXBizDataCrypt')
const axios = require('axios')
const wxpay = require('../tools/wxpay')
const Config = require('../config')
const { getAccessToken } = require('../tools/access-token')
const uuid = require('uuid/v4');
const { formatDateTime } = require('../tools/tools')

Parse.Cloud.define('GetOpenId', async request => {
    let p = request.params
    let appId = Config.WechatAppID
    let secret = Config.WechatAppSecret

    let params = {
        //小程序唯一标识
        appid: appId,//小程序的 app secret
        secret: secret,
        grant_type: 'authorization_code',
        js_code: p.code
    }
    console.log('params' + JSON.stringify(params))

    let { data } = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
        params: params
    }).then()

    return data

})

Parse.Cloud.define('WXdecryptData', async res => {
    let p = res.params
    console.log(p);
    let appId = Config.WechatAppID
    let secret = Config.WechatAppSecret

    let r = await axios.get(
        `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${
        p.code
        }&grant_type=authorization_code`
    ).then()

    console.log('请求返回');
    console.log(r.data);
    console.log('请求返回e');

    let pc = new WXBizDataCrypt(appId, r.data.session_key)
    let rawData = pc.decryptData(p.encryptedData, p.iv)
    console.log('解密的结果') // 合并两个函数后，登录快多啦。。。。。
    console.log(rawData) // 合并两个函数后，登录快多啦。。。。。
    console.log('解密的结果') // 合并两个函数后，登录快多啦。。。。。
    if (!!rawData) {
        return rawData
    } else {
        return { code: -1, msg: '解密失败' }
    }

})

Parse.Cloud.define('getAccessToken', async req => { // 微信获取token
    return await getAccessToken().then()
})

Parse.Cloud.define('')



