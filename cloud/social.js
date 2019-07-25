let Parse = require('parse/node');
let Follower = Parse.Object.extend('Follower')
let Following = Parse.Object.extend('Following')
let Comment = Parse.Object.extend('Comment')
let Question = Parse.Object.extend('Question')
let Publish = Parse.Object.extend('Publish')
let Review = Parse.Object.extend('Review')
let Like = Parse.Object.extend('Like')
let UserInfo = Parse.Object.extend('UserInfo')

module.exports = {
    follow: async req => { // 当别人关注我


        console.log('nvuhfu' + JSON.stringify(req))
        let meId = req.user.id
        let followingId = req.params.id  // 我关注的id
        let mePointer = Parse.User.createWithoutData(meId)
        let followingPointer = Parse.User.createWithoutData(followingId)

        let follower = new Follower()
        let following = new Following()

        let r = await Parse.Object.saveAll([ // 生成两个记录
            follower.set({
                user: followeePointer,
                follower: mePointer
            }),

            mePointer.increment('following'),

            followingPointer.increment('follower'),

            followee.set({
                user: mePointer,
                followee: followeePointer
            })
        ], { useMasterKey: true }).then()



        return r
    },





    checkIsLike: async req => {
        let p = req.params
        let targetId = Parse.Object.extend('Publish').createWithoutData(p.id)
        let userId = Parse.User.createWithoutData(req.user.id)
        let check_doublelike = await new Parse.Query('Like').equalTo('userId', userId).equalTo('targetId', targetId).find()

        if (check_doublelike.length == 0) {
            return true
        }
        else {
            return false
        }
    },

    addLike: async req => { // 为了防止用户重复点赞，可以使用一个表记录用户的最近的操作，如果已经点赞，就不显示。
        let p = req.params
        let target = p.name    //
        let id = p.id
        let targetPointer = Parse.Object.extend(target).createWithoutData(id)
        let userPointer = Parse.User.createWithoutData(req.user.id)
        let check_doublelike = await new Parse.Query('Like').equalTo('userId', userPointer).equalTo('targetId', targetPointer).find()
        if (check_doublelike.length == 0) {
            let like = new Like()
            let r = await like.set({
                userId: userPointer,
                targetId: targetPointer,
                targetName: target
            }).save().then()
            targetPointer.increment('like').save()
            let targetlike = await new Parse.Query('Publish').get(id)
            let targetuseridPionter= targetlike.get('user')
            let userinfo = await new Parse.Query('UserInfo').equalTo('user', targetuseridPionter).find()
            console.log('fsdat'+userinfo.length)
            if (userinfo.length == 0) {
                let newuserinfo = new UserInfo()
                await newuserinfo.set({
                    'user': targetuseridPionter,
                    'like': 1,
                }).save()   
            } else {
                targetuserinfoPointer = Parse.Object.extend('UserInfo').createWithoutData(userinfo[0].id)
                targetuserinfoPointer.increment('like').save()
            }
            let q = await new Parse.Query(target).get(p.id)
            return q._toFullJSON()
        }
        },

        followerNumber: async req => {
            p = req.params

        }




    }