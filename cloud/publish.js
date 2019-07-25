let Parse = require('parse/node');
let Comment = Parse.Object.extend('Comment')
let Question = Parse.Object.extend('Question')
let Publish = Parse.Object.extend('Publish')
let Review = Parse.Object.extend('Review')
let Like = Parse.Object.extend('Like')

let OSS = require('ali-oss')
let client = new OSS({
    region: 'oss-us-east-1',
    accessKeyId: 'LTAIeuZ0sLZS7tsT',
    accessKeySecret: 'q5qgBsUVQzc9xF9NrhQuwzYCz5zGmI',
    bucket: 'tedacar',
});
module.exports = {

    addEvent: async req => {
        console.log('req' + JSON.stringify(req))
    },

    // addLike: async req => { // 为了防止用户重复点赞，可以使用一个表记录用户的最近的操作，如果已经点赞，就不显示。
    //     let p = req.params
    //     console.log('vgggg'+JSON.stringify(p))
    //     let target = p.name
    //     let id = p.id
    //     let targetid= Parse.Object.extend(target).createWithoutData(id)
    //     let userid = Parse.User.createWithoutData(req.user.id)
    //     let like = new Like()
    //     let r = await like.set({
    //         Id:userid,
    //         targetId:id,
    //         targetName:target
    //     }).save().then()
    //     let targetlist = await Parse.Query(target)
    //     .extend(target).increment('like').save().then()
    //     return r
    // },
    
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
            'targetId': p.targetId,
            'title': p.title || '',
            'comment': !!p.commentId ? Parse.Object.extend('Comment').createWithoutData(p.commentId): undefined

        }).save()

        return r
    },
    deleteImgAliOSS: async req => {

        let deleteFileName = req.params.fileName
        console.log('deleteFileName'+JSON.stringify(deleteFileName))
        let reg=new RegExp('http://tedacar.oss-us-east-1.aliyuncs.com/');
        let deleteUrl=deleteFileName.replace(reg,"")
        let result = await client.delete(deleteUrl);
        console.log(result);
    
       return result
},

    getComment: async req => {
        
        let p = req.params
       
        // console.log('xuus'+JSON.stringify(req))
        console.log('nxjbius'+JSON.stringify(req.params))

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
        console.log('jhhjjj'+JSON.stringify(req.params))
        let userPointer = Parse.User.createWithoutData(req.user.id)

        let publish = new Publish()
        console.log('nucn'+p.img)
        return await publish.set({
            title: p.title,
            desc: p.desc,
            user: userPointer,
            image:p.img,
        }).save()
    },

    testpostStatus : async req => {
        let p = req.params
        // let userPointer = Parse.User.createWithoutData(req.user.id)
        let publish = new Publish()
        return await publish.set({
            title: p.title,
            desc: p.desc,
            // user: userPointer,
            image:p.oosArr,
        }).save()
    },

    getStatus: async req => {
        let p = req.params
        let r = await new Parse.Query('Publish').include('user').limit(10).descending("createdAt").find()
        let q=  await new Parse.Query('Publish').descending("createdAt").limit(10).find()
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
        return r.map( (x,index) => {
            y = x._toFullJSON()
            y.redheart = heart[index]  
            return y
        })
    },

    getStatusDetail: async req => {
        let p = req.params
        console.log('jgkhkgkgg'+p.id + '1111')
        let r = await new Parse.Query('Publish').include('user').get(p.id)
        // r.image = "http://tedacar.oss-us-east-1.aliyuncs.com/" +r.image
        console.log('ooooooo'+JSON.stringify(r))
        return r._toFullJSON()
    }




}