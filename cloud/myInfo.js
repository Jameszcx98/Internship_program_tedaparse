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
}