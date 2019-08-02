let Parse = require('parse/node');
let Comment = Parse.Object.extend('Comment')
let Question = Parse.Object.extend('Question')
let Publish = Parse.Object.extend('Publish')
let Review = Parse.Object.extend('Review')
let Like = Parse.Object.extend('Like')
let Favor = Parse.Object.extend('Favor')

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
            like:0,
            favor:0
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
        let skipnumber = req.params.number
        if(skipnumber==null){
        skipnumber = 0
        }
        console.log('grggrfdf'+skipnumber)
        let user = Parse.User.createWithoutData(req.user.id)
        let followingList = await new Parse.Query('Following').equalTo('user',user).equalTo('status',true).find()
        let followinguserList = followingList.map( x=>{
            y = x._toFullJSON()
            return y.following
        })
        let maxlist = await new Parse.Query('Publish').containedIn('user',followinguserList).include('user').descending("createdAt").find()
        console.log('dfassafd'+maxlist.length)
        if(maxlist.length>skipnumber){//判断是否表里剩余的动态
        let r = await new Parse.Query('Publish').containedIn('user',followinguserList).include('user').descending("createdAt").skip(skipnumber).limit(10).find()
        let q=  await new Parse.Query('Publish').containedIn('user',followinguserList).descending("createdAt").skip(skipnumber).limit(10).find() //是否已经点过赞
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
        return r.map( (x,index) => {
            y = x._toFullJSON()
            y.redheart = heart[index]  
            y.redfavor = favor[index]
            return y
        })
    } else if(maxlist.length==0){
        return false
    }else{
        return;
    }
    
    },

    getStatushot:async req =>{
        let skipnumber = req.params.number
        if(skipnumber==null){
        skipnumber = 0
        }
        let maxlist = await new Parse.Query('Publish').include('user').descending("like").find()
        if(maxlist.length>skipnumber){
        let r = await new Parse.Query('Publish').include('user').skip(skipnumber).limit(10).descending("like").find()
        let q=  await new Parse.Query('Publish').descending("like").skip(skipnumber).limit(10).find()
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
        let favorPromises = q.map(x => {
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
        return r.map( (x,index) => {
            y = x._toFullJSON()
            y.redheart = heart[index]  
            y.redfavor = favor[index]
            return y
        })
    }
    else if(maxlist.length==0){
        return false
    }else{
        return;
    }

    },
    getStatusme:async req =>{
        let skipnumber = req.params.number
        if(skipnumber==null){
        skipnumber = 0
        }
        let user = Parse.User.createWithoutData(req.user.id)
        let maxlist = await new Parse.Query('Publish').equalTo('user',user).include('user').descending("createdAt").find()
        if(maxlist.length>skipnumber){
        let r = await new Parse.Query('Publish').equalTo('user',user).include('user').skip(skipnumber).limit(10).descending("createdAt").find()
        let q=  await new Parse.Query('Publish').equalTo('user',user).descending("createdAt").skip(skipnumber).limit(10).find()
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
        let favorPromises = q.map(x => {
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
        return r.map( (x,index) => {
            y = x._toFullJSON()
            y.redheart = heart[index]
            y.redfavor = favor[index]  
            return y
        })
    } else if(maxlist.length==0){
        return false
    }else{
        return;
    }

    },
    getStatusDetail: async req => {
        let p = req.params
        let mePointer = Parse.User.createWithoutData(req.user.id)
        let r = await new Parse.Query('Publish').include('user').get(p.id)
        let y = r._toFullJSON()
        let targetPointer = Parse.User.createWithoutData(y.user.objectId)
        console.log('111111111'+JSON.stringify(mePointer))
        console.log('22222222222222'+JSON.stringify(targetPointer))
        let followingList = await new Parse.Query('Following').equalTo('user',mePointer).equalTo('following',targetPointer).equalTo('status',true).find()

        console.log('dfafaf'+JSON.stringify(followingList.length))
        if(followingList.length ==0){
            y.followSign = false
        }else{
            y.followSign = true
        }
        return y
        
    },




}