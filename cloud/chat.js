const q = require('../tools/request')
let Parse = require('parse/node')



module.exports = {
    getChatList : async req =>{
        let r = await new Parse.Query('Shop').find()
        console.log("rrrr:",r)
    },
}