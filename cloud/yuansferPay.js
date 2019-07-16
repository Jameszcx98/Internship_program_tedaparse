var crypto = require('crypto'); //加载加密文件
const axios = require('axios')
//md5
function md5(data) {
    var md5 = crypto.createHash('md5');
    return md5.update(data).digest('hex');
}

//计算数字签名
function calculateVerifySign(contents) {
    //1.对参数进行排序，然后用a=1&b=2..的形式拼接
    var sortStr = '';
    for (var key of Object.keys(contents).sort()) {
        sortStr = sortStr + key + '=' + contents[key] + '&';
    }

    //对token进行md5，得到的结果追加到sortStr之后
    var tokenMd5 = md5('5cbfb079f15b150122261c8537086d77a');
    var tempStr = sortStr + tokenMd5;

    console.log('tempStr:', tempStr);

    //对tempStr 在进行一次md5加密得到verifySign
    var verifySign = md5(tempStr);

    console.log('veirfySign:', verifySign);
    return verifySign;
}

module.exports = {
    pay: async req => {

        let reqUrl = '/securepay'

        if (reqUrl == '/securepay') {
            let token = '5cbfb079f15b150122261c8537086d77a'
            let nowTime = new Date()
            let randomReference = 'test_' + nowTime.getTime()

            let contents = {
                'merchantNo': '200043',
                'storeNo': '300014',
                'currency': 'USD',
                'rmbAmount': '0.1',
                'description': 'testDescription',
                'note': 'testNote',
                'ipnUrl': 'http://nengjtian.s1.natapp.cc/login/test',
                'callbackUrl': 'http://nengjtian.s1.natapp.cc/login/test2?rmbAmount={rmbAmount}',
                'terminal': 'ONLINE',
                'vendor': 'wechatpay',
                'timeout': '120',
                'reference': randomReference   //商户支付流水号，要求不能重复
            }

            //计算数字签名
            var verifySign = calculateVerifySign(contents);

            //把数字签名加到请求参数中 
            contents.verifySign = verifySign;
            //发送http post 请求到yuansfer

            var opt = {
                host: 'mapi.yuansfer.yunkeguan.com',
                port: '80',
                path: '/appTransaction/v2/securepay', //斜杠开头
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, //设置content-type 头部
            }

            return await axios({
                
            })



        }

    }
}