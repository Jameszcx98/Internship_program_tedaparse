let Parse = require('parse/node')
let Pin = Parse.Object.extend('Pin')

module.exports = {

    newGroupBuy: async req => {
        console.log('req' + JSON.stringify(req.user.id) )
        let userId = req.user.id
        let sku = req.params.sku
        let userPointer = Parse.User.createWithoutData(userId)
        let pin = new Pin()
        return await pin.set({
            user: userPointer,
            itemSku: sku,
        }).save().then()
    },

    joinGroupBuy: async req => {
        let userId = req.user.id
        let pinId = req.params.pinId
        let userPointer = Parse.User.createWithoutData(userId)
        let pin = Parse.Object.createWithoutData('Pin',pinId)
        let pinList = new pinList()
        return await pinList.set({
            pin: pin,
            user: userPointer
        }).save().then()
    },

    getGroupBuy: async req => {
        let sku = req.params.sku
        let r = await new Parse.Query('Pin')
        .include('user').equalTo('itemSku',sku).find().then()
        console.log('rrrrrrrr' + JSON.stringify(r) )
        
        return r
    }




}