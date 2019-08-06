const q = require('../tools/request')
// let Parse = require('parse/node')

// 导入子模块的文件
let magentoRestful = require('./magentoRestful')
let magentoGraphql = require('./magentoGraphql')
let groupBuy = require('./groupBuy')
let publish = require('./publish')
let social = require('./social')
let wechat = require('./wechat')
let yuansferPay = require('./yuansferPay')
let aliyun = require('./aliyun')
let myInfo = require('./myInfo')

// const axios = require('axios')
let uploadCar = require('./uploadCar')

// 导入钩子模块
let afterSaveHook = require('./afterSaveHook')
let beforeSaveHook = require('./beforeSaveHook')

// 导入Firebase
let firebase = require('./firebase')

let chat = require('./chat')


for (x in magentoGraphql) {
    Parse.Cloud.define(x, magentoGraphql[x])
}
for (x in magentoRestful) {
    Parse.Cloud.define(x, magentoRestful[x])
}
for (x in groupBuy) {
    Parse.Cloud.define(x, groupBuy[x])
}
for (x in publish) {
    Parse.Cloud.define(x, publish[x])
}
for( x in social){
    Parse.Cloud.define(x, social[x])
}
for (x in wechat) {
    Parse.Cloud.define(x, wechat[x])
}
for (x in yuansferPay) {
    Parse.Cloud.define(x, yuansferPay[x])
}
for (x in uploadCar) {                            
    Parse.Cloud.define(x, uploadCar[x])          //引入uploadCar
}
for (x in firebase) {
    Parse.Cloud.define(x, firebase[x])
}

for (x in myInfo) {
    Parse.Cloud.define(x, myInfo[x])
}


for( x in afterSaveHook){
    Parse.Cloud.afterSave(x, afterSaveHook[x])
}
for( x in beforeSaveHook){
    Parse.Cloud.beforeSave(x, beforeSaveHook[x])
}
for( x in aliyun){
    Parse.Cloud.beforeSave(x, aliyun[x])
}
for( x in chat){
    Parse.Cloud.beforeSave(x, chat[x])
}





Parse.Cloud.define('changeLang', async req => {
    // 修改全局变量，用来控制请求的后台语言
    global.lang = req.params.lang
    console.log('改变全局变量之后')
    console.log(global.lang)
})




