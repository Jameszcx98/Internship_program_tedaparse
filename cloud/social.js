let Parse = require('parse/node');
let Follower = Parse.Object.extend('Follower')
let Following = Parse.Object.extend('Following')
let Comment = Parse.Object.extend('Comment')
let Question = Parse.Object.extend('Question')
let Publish = Parse.Object.extend('Publish')
let Review = Parse.Object.extend('Review')
let Like = Parse.Object.extend('Like')
let UserInfo = Parse.Object.extend('UserInfo')
let Favor = Parse.Object.extend('Favor')
let News = Parse.Object.extend('News')

module.exports = {
    follow: async req => { // 当别人关注我
        let news = new News()   //创建news表添加news信息    
        let meId = req.user.id
        let followingId = req.params.id  // 我关注的id
        let mePointer = Parse.User.createWithoutData(meId)
        let followingPointer = Parse.User.createWithoutData(followingId)
        let precheck = await new Parse.Query('Following').equalTo('user',mePointer).equalTo('following',followingPointer).equalTo('status',true).find()//检查是否已经关注
        let newsnumber = await new Parse.Query('News').equalTo('user',meId).equalTo('status',true).find()
        if(meId!=followingId&&precheck.length==0){
        let follower = new Follower()
        let following = new Following()
        let r = await Parse.Object.saveAll([ // 生成三个记录
            follower.set({
                user: followingPointer,
                follower: mePointer,
                status:true
            }),
            following.set({
                user: mePointer,
                following: followingPointer,
                status:true
            }),
            news.set({
                "user":followingPointer,
                "targetuserPointer":mePointer,
                "eventPointer":null,
                "targetName":'follower',
                "status":true,
                'number':newsnumber.length+1

            })
        ]).then()
        let meInfo = await new Parse.Query('UserInfo').equalTo('user',mePointer).find()
        let targetInfo = await new Parse.Query('UserInfo').equalTo('user',followingPointer).find()
        if(meInfo.length==0){
            let newInfo = new UserInfo()
            await newInfo.set({
                user:mePointer,
                like:0,
                favor:0,
                follower:0,
                following:1,
                
            }).save()
        }else {
            meInfo[0].increment('following').save()
        }
        if(targetInfo == 0){
            let newInfo = new UserInfo()
            await newInfo.set({
                user:followingPointer,
                like:0,
                favor:0,
                follower:1,
                following:0
            }).save()  
        }else{
            targetInfo[0].increment('follower').save()
        }
        return followingId
        }else{
            return false
        }
    },
    
    unfollow: async req=>{
        let meId = req.user.id
        let followingId = req.params.id  // 我关注的id
        let mePointer = Parse.User.createWithoutData(meId)
        let followingPointer = Parse.User.createWithoutData(followingId)
        let followingDelte = await new Parse.Query('Following').equalTo('user',mePointer).equalTo('following',followingPointer).equalTo('status',true).find()
        let followingPiont = Parse.Object.extend('Following').createWithoutData(followingDelte[0].id)
        await followingPiont.set({
            status:false
        }).save().then()
        let followerDelte = await new Parse.Query('Follower').equalTo('user',followingPointer).equalTo('follower',mePointer).equalTo('status',true).find()
        let followerPiont = Parse.Object.extend('Follower').createWithoutData(followerDelte[0].id)
        await followerPiont.set({
            status:false
        }).save().then()
        let meInfo = await new Parse.Query('UserInfo').equalTo('user',mePointer).find()
        let targetInfo = await new Parse.Query('UserInfo').equalTo('user',followingPointer).find()
        console.log('cvzounaiuf'+JSON.stringify(meInfo[0]))
        meInfo[0].increment('following',-1).save()
        targetInfo[0].increment('follower',-1).save()
        return followingDelte[0]._toFullJSON()
    },

    addSubscription:  async req =>{
        let query = await new Parse.Query('')
        let subscription = await query.subscribe()
        subscription.on('open', () => {
            console.log('subscription opened!we23rq2ewar32231312!!!!!!!!!!!!!!')
        })
        subscription.on('update', (Follower) => {
            console.log('object updated');
        });
        // subscription.on('create', (object) => {
        //     console.log('object created');
        //   });
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
        let news = new News()
        let p = req.params
        let target = p.name    //我点赞的属性
        let id = p.id
        let targetPointer = Parse.Object.extend(target).createWithoutData(id)//我点赞的动态
        let userPointer = Parse.User.createWithoutData(req.user.id)//我的id
        let targetlike = await new Parse.Query('Publish').get(id)
        let targetuseridPionter= targetlike.get('user')//我点赞的对象
        let newsnumber = await new Parse.Query('News').equalTo('user',userPointer).equalTo('status',true).find()
        let like = new Like()
        let r = await Parse.Object.saveAll([
            like.set({
                userId: userPointer,
                targetId: targetPointer,
                targetName: target
            }),
            news.set({
                user:targetuseridPionter,
                targetuserPointer:userPointer,
                eventPointer:targetPointer,
                targetName:'addLike',
                status:true,
                number:newsnumber.length+1

            })
        ]).then()
        targetPointer.increment('like').save()
        let userinfo = await new Parse.Query('UserInfo').equalTo('user', targetuseridPionter).find()
        console.log('fsdat'+userinfo.length)
        if (userinfo.length == 0) {
            let newuserinfo = new UserInfo()
            await newuserinfo.set({
                'user': targetuseridPionter,
                'like': 1,
                'favor':0,
                'follower':0,
                'following':0,
            }).save()   
        } else {
            targetuserinfoPointer = Parse.Object.extend('UserInfo').createWithoutData(userinfo[0].id)
            targetuserinfoPointer.increment('like').save()
        }
        let q = await new Parse.Query(target).get(p.id)
        return q._toFullJSON()        
    
        },

    

    addFavor: async req=>{
        let id = req.params.id
        let targetname = req.params.name
        let targetPointer = Parse.Object.extend(targetname).createWithoutData(id)
        let userPointer = Parse.User.createWithoutData(req.user.id)
        let check_doubleFavor = await new Parse.Query('Favor').equalTo('userId', userPointer).equalTo('targetId', targetPointer).equalTo('status',true).find()
        if (check_doubleFavor.length == 0) {
            let favor = new Favor()
            let r = await favor.set({
                userId: userPointer,
                targetId: targetPointer,
                targetName: targetname,
                status: true
            }).save().then()
            targetPointer.increment('favor').save()
            let userinfo = await new Parse.Query('UserInfo').equalTo('user', userPointer).find()
            console.log('fsdat'+userinfo.length)
            if (userinfo.length == 0) {
                let newuserinfo = new UserInfo()
                await newuserinfo.set({
                    'user': userPointer,
                    'like': 0,
                    'favor':1,
                    'fowllower':0,
                    'following':0,
                }).save()   
            } else {
                userinfoPointer = Parse.Object.extend('UserInfo').createWithoutData(userinfo[0].id)
                userinfoPointer.increment('favor').save()
            }
            let q = await new Parse.Query('Publish').get(id)
            return q._toFullJSON()
        }

    },

    subFavor: async req=>{
        let id = req.params.id
        let targetname = req.params.name
        let targetPointer = Parse.Object.extend(targetname).createWithoutData(id)
        let userPointer = Parse.User.createWithoutData(req.user.id)
        let favor = await new Parse.Query('Favor').equalTo('userId', userPointer).equalTo('targetId', targetPointer).equalTo('status',true).find()
        let deletePointer = Parse.Object.extend('Favor').createWithoutData(favor[0].id)
        await deletePointer.set({
            status:false
        }).save().then()
        targetPointer.increment('favor',-1).save()
        let userinfo = await new Parse.Query('UserInfo').equalTo('user', userPointer).find()
        userinfoPointer = Parse.Object.extend('UserInfo').createWithoutData(userinfo[0].id)
        userinfoPointer.increment('favor',-1).save()
        let q = await new Parse.Query('Publish').get(id)
        return q._toFullJSON()
        },

    }

       




    
