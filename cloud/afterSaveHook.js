let Parse = require('parse/node');
let Activity = Parse.Object.extend('Activity')

// 这里主要处理用户有新动态之后的通知，比如比如push 到 APP 或者小程序
        // 这里要非常注意，这里是uer 需要json 下才能拿到

module.exports = {
    Comment: async req => { // 评论之后执行
        let user = req.object.get('user').id
        let target = req.object.get('target').id
        let targetName = req.object.get('targetName')

        // console.log('1' + JSON.stringify(user) )
        // console.log('2' + JSON.stringify(target) )
        // console.log('3' + JSON.stringify(targetName) )
        let userPointer = Parse.User.createWithoutData(user)

        let targetPointer = Parse.Object.extend(targetName).createWithoutData(target)
        
        // console.log('奇怪，看看这个pointer 是什么' + JSON.stringify(targetPointer) )
        // console.log('奇怪，看看这个 userr   pointer 是什么' + JSON.stringify(userPointer) )

        let activity = new Activity()
        return await activity.set({
            user: userPointer,
            target: targetPointer
        }).save()
        
    }
}