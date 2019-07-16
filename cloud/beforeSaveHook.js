let Parse = require('parse/node');
let Activity = Parse.Object.extend('Activity')

module.exports = {
    Comment: async req => { // 评论之后执行， 
        // 这里需要处理防止用户瞎提交
        // 还有限制用户提交次数
        // 这里要非常注意，这里是uer 需要json 下才能拿到。。
        
        console.log('req' + JSON.stringify(req) )
        
        // let user = req.object.get('user').id
        // let targetId = req.object.get('target').id
        // let targetName = req.object.get('targetName')
        // let commentId = req.object.get('comment').id
        
        // let userPointer = Parse.User.createWithoutData(user)
        // let targetPointer = Parse.Object.extend(targetName).createWithoutData(targetId)

        // let time  = new Date()
        // console.log('time' + JSON.stringify(time) )
        
        // let todayActivity = await new Parse.Query('Activity').equalTo('user',userPointer).lessThanOrEqualTo('updatedAt',time).find()

        // console.log('todayActivity' + JSON.stringify(todayActivity) )
        
        
        
    }
}