let Parse = require('parse/node');
let Follower = Parse.Object.extend('Follower')
let Followee = Parse.Object.extend('Followee')

module.exports = {
    follow : async req => { // 当别人关注我
        let followeeId = req.params.followeeId  // 我
        let meId = req.user.id

        let mePointer = Parse.User.createWithoutData(meId)
        let followeePointer = Parse.User.createWithoutData(followeeId)

        let follower = new Follower()
        let followee = new Followee()

        let r = await Parse.Object.saveAll([ // 生成两个记录
            follower.set({
                user:followeePointer,
                follower:mePointer
            }),

            followee.set({
                user:mePointer,
                followee:followeePointer
            })
        ]).then()

        return r
    },

    

   
}