let Parse = require('parse/node');
let Follower = Parse.Object.extend('Follower')
let Following = Parse.Object.extend('Following')
let Comment = Parse.Object.extend('Comment')
let Question = Parse.Object.extend('Question')
let Publish = Parse.Object.extend('Publish')
let Review = Parse.Object.extend('Review')
let Like = Parse.Object.extend('Like')
let UserInfo = Parse.Object.extend('UserInfo')
let News = Parse.Object.extend('News')

module.exports = {
    userInfo: async req=>{//查询用户帖子获赞数量
        let user = Parse.User.createWithoutData(req.user.id)
        let number = await new Parse.Query('UserInfo').equalTo('user',user).find()
        let userInfo = await new Parse.Query('User').get(req.user.id)
        if(number.length==0){
            let y =userInfo._toFullJSON()
            y.likenumber = 0
            y.favornumber = 0
            y.follower = 0
            y.following =0
            return y
        }else{
            let y =userInfo._toFullJSON()
            y.likenumber = number[0].get('like')
            y.favornumber = number[0].get('favor')
            y.follower = number[0].get('follower')
            y.following = number[0].get('following')
            return y

        }
    },

    getFavorList: async req=>{//查询用户收藏列表
        let skipnumber = req.params.num
        let user = Parse.User.createWithoutData(req.user.id)
        let favorresult = await new Parse.Query('Favor').equalTo('userId',user).equalTo('status',true).find()
        let favoridlist = favorresult.map( x=>{
            y = x._toFullJSON()
            return y.targetId.objectId
        })
        let maxlist = await new Parse.Query('Publish').containedIn('objectId',favoridlist).include('user').descending("createdAt").find()
        if(maxlist.length>skipnumber){
        let favorlist = await new Parse.Query('Publish').containedIn('objectId',favoridlist).include('user').descending("createdAt").skip(skipnumber).limit(10).find()
        let q=  await new Parse.Query('Publish').containedIn('objectId',favoridlist).descending("createdAt").skip(skipnumber).limit(10).find() //是否已经点过赞
        let promises = q.map(x => {
            targetId = Parse.Object.extend('Publish').createWithoutData(x.id)    
            userId = Parse.User.createWithoutData(req.user.id)
            return new Parse.Query('Like').equalTo('userId',userId).equalTo('targetId',targetId).find()
        })
        let checkList =  await Promise.all( promises ).then()
        let heart = []
        checkList.map((x,i)=>{   
            if(x.length==0){
                heart[i] = false
            }
            else{
                heart[i] = true
            }
        })
        let favorPromises = q.map(x => {//是否已经收藏
            targetId = Parse.Object.extend('Publish').createWithoutData(x.id)    
            userId = Parse.User.createWithoutData(req.user.id)
            return new Parse.Query('Favor').equalTo('userId',userId).equalTo('targetId',targetId).equalTo('status',true).find()
        })
        let favorCheckList =  await Promise.all( favorPromises ).then()
        let favor = []
        favorCheckList.map((x,i)=>{   
            if(x.length==0){
                favor[i] = false
            }
            else{
                favor[i] = true
            }
        })
        return favorlist.map( (x,index) => {
            y = x._toFullJSON()
            y.redheart = heart[index]  
            y.redfavor = favor[index]
            return y
        })
        
        }else{
            return;
        }
    },

    addSubscription:  async req =>{
        let query = await new Parse.Query('Publish')
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

    getFollowerList: async req=>{//拿到粉丝列表
        let user = Parse.User.createWithoutData(req.user.id)
        let follower = await new Parse.Query('Follower').include('follower').equalTo('user',user).equalTo('status',true).find()
        let followingStatus = await new Parse.Query('Following').equalTo('user',user).equalTo('status',true).find()
        let followerList = follower.map( x=>{
            let y = x._toFullJSON()
            return y
        })
        let followingId = followingStatus.map(x=>{
            let y = x._toFullJSON()
            return y.following.objectId
        })
        let followerId = followerList.map(x=>{
            return x.follower.objectId
        })
        followerId.map((x,index)=>{
            if(followingId.indexOf(x)>=0){
                followerList[index].status = true
            }else{
                followerList[index].status = false
            }
        })
        return followerList.map(x=>x)
        
    },

    getFollowingList: async req=>{//拿到关注列表
        let user = Parse.User.createWithoutData(req.user.id)
        let followingList = await new Parse.Query('Following').include('following').equalTo('user',user).equalTo('status',true).find()
        return followingList.map(x=>x._toFullJSON())

    },
    
    getNews: async req=>{//拿到消息列表

        let skipnumber = req.params.number
        let user = Parse.User.createWithoutData(req.user.id)
        let newsListLocal = await new Parse.Query('News').equalTo('user',user).descending('createdAt').include('targetuserPointer').include('eventPointer').skip(skipnumber).limit(10).find()
        let newsList = await new Parse.Query('News').equalTo('user',user).descending('createdAt').include('targetuserPointer').include('eventPointer').skip(skipnumber).limit(10).find()
        let promises = newsList.map(x=>{
            return  x.set({
                status:false
            }).save()
        })
        await Promise.all( promises ).then()
        return newsListLocal.map(x=>x._toFullJSON())

},
}