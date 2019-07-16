const WXPay = require('weixin-pay');


const wxpay = WXPay({
    appid: 'wxbbf2f719dc355452',
    mch_id: '1514097601',
    partner_key: '', //微信商户平台 API secret，非小程序 secret
    // pfx: fs.readFileSync('./wxpay_cert.p12'), //微信商户平台证书，暂不需要
});

// 

module.exports = wxpay;