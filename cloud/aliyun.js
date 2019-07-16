const Config = require('../config')
let OSS = require('ali-oss')

let aliyunConfig = Config.aliyun

let client = new OSS({
    region: aliyunConfig.region,
    accessKeyId: aliyunConfig.OSSAccessKeyId,
    accessKeySecret: aliyunConfig.AccessKeySecret,
    bucket: aliyunConfig.bucket,
});

Parse.Cloud.define('getAliyunConfig', async req => {
    return Config.aliyun
})
Parse.Cloud.define('deleteImage', async req => {
    let imgUrl = req.params.url
    let reg = new RegExp(aliyunConfig.url);

    let result = await client.delete(imgUrl.replace(reg,""));
    return result
})
