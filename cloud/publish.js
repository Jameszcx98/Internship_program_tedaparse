let Parse = require('parse/node');
let Comment = Parse.Object.extend('Comment')
let Question = Parse.Object.extend('Question')
let Publish = Parse.Object.extend('Publish')
let Review = Parse.Object.extend('Review')

module.exports = {

    addEvent: async req => {
        console.log('req' + JSON.stringify(req))
    },

    addLike: async req => { // 为了防止用户重复点赞，可以使用一个表记录用户的最近的操作，如果已经点赞，就不显示。
        let p = req.params
        let target = p.targetName
        let id = p.targetId
        let targetPointer = Parse.Object.extend(target).createWithoutData(id)
        return targetPointer.increment('like').save().then()
    },

    postQuestion: async req => { // 
        let q = req.params
        let question = new Question()
        console.log('req' + JSON.stringify(req.user))
        let userPointer = Parse.User.createWithoutData(req.user.id)
        console.log('userPointer' + JSON.stringify(userPointer))

        let r = await question.set({
            sku: q.sku,
            title: q.title,
            desc: q.desc,
            user: userPointer
        }).save().then()
        return r
    },

    getQuestions: async req => {
        let p = req.params
        let q = await new Parse.Query('Question').descending('createdAt').include('user').find()
        return q.map(x => x._toFullJSON())
    },

    // postReview: async req => {
    //     let q = req.params
    //     let review = new Review()
    //     console.log('req' + JSON.stringify(req.user))
    //     let userPointer = Parse.User.createWithoutData(req.user.id)
    //     console.log('userPointer' + JSON.stringify(userPointer))
    //     let r = await review.set({
    //         sku: q.sku,
    //         title: q.title,
    //         desc: q.desc,
    //         user: userPointer
    //     }).save().then()
    //     return r
    // },

    

    postComment: async req => {
        // 必须有  desc targetId targetName
        let p = req.params
        if (!(p.desc && p.targetId && p.targetName)) {
            throw console.error('参数不全，至少有评论内容，目标ID,目标类型');
        }
        console.log('看看参数' + JSON.stringify(p) )

        let targetPointer = Parse.Object.extend(p.targetName).createWithoutData(p.targetId)  // 创造普通的pointer
        let userPointer = Parse.User.createWithoutData(req.user.id) // 拿到用户Pointer

        // console.log('q' + JSON.stringify(targetPointer))
        // console.log('p.commentId' + JSON.stringify(!!p.commentId) )
        

        let comment = new Comment()
        let r = await comment.set({
            'user': userPointer,
            'targetName':p.targetName,
            [p.targetName]: targetPointer, // 键值为 target Name
            'desc': p.desc,
            'ifFather': !!p.commentId ? false : true,
 
            'title': p.title || '',
            'comment': !!p.commentId ? Parse.Object.extend('Comment').createWithoutData(p.commentId): undefined

        }).save()
        return r
    },


    getComment: async req => {
        
        let p = req.params

        let userPointer = Parse.User.createWithoutData(req.user.id)

        let q = new Parse.Query('Comment').descending('updatedAt')

        if (p.targetId) {
            q.equalTo('targetId', p.targetId)
        }
        if (p.targetName) {
            q.equalTo('targetName', p.targetName)
        }
        if (p.user) {
            q.equalTo('user', userPointer)
        }
        
        if (p.commentId){
            let commentPointer = Parse.Object.extend('Comment').createWithoutData(p.commentId)
            q.equalTo('comment',commentPointer)
        }else{
            q.equalTo('ifFather', true) // 否则就找到ifFather，说明这个不是回复
        }
        
        let r = await q.find()
        return r.map(x => x._toFullJSON())
    },

    getActivity: async req => {
        let p = req.params

    },

    postStatus : async req => {
        let p = req.params

        
        let userPointer = Parse.User.createWithoutData(req.user.id)
        let publish = new Publish()
        return await publish.set({
            title: p.title,
            desc: p.desc,
            user: userPointer,
            image:p.image
        }).save()
    },

    getStatus: async req => {
        let p = req.params
        let r = await new Parse.Query('Publish').include('user').find()
        return r.map(x => x._toFullJSON())
    },

    getStatusDetail: async req => {
        let p = req.params
        console.log(p.id + 1111)
        let r = await new Parse.Query('Publish').include('user').get(p.id)
        console.log(r)
        return r._toFullJSON()
    }



}