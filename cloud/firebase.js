let Parse = require('parse/node')
let Conversation = Parse.Object.extend('Conversation');
let Message = Parse.Object.extend('Message')

module.exports = {
    getChatList : async req =>{
        let p = req.params
        console.log("pppp:",p)
        console.log("pMethod;",p.method)  //method==0 我关注的    method==1 陌生人

        let skipnumber = req.params.number
        let user = Parse.User.createWithoutData(req.user.id)     //当前用户
        
        
        let maxList = await new Parse.Query('Conversation').equalTo('user',user).find()
        let chatList =[]
        if(maxList.length>skipnumber){
            if(p.method === 0){
                    chatList = await new Parse.Query('Conversation').equalTo('user',user).equalTo('status',true).include('friend').descending('updatedAt').skip(skipnumber).limit(10).find()
            }else if(p.method === 1){
                    chatList = await new Parse.Query('Conversation').equalTo('user',user).equalTo('status',false).include('friend').descending('updatedAt').skip(skipnumber).limit(10).find()
            }
            
            let promises = chatList.map( x=>{
                let targetPoint = x.get('friend')
                let chaterList = [user,targetPoint]
                return new Parse.Query('Message').containedIn('from',chaterList).containedIn('to',chaterList).descending('createdAt').limit(1).find()
            })
            let chatDetail = await Promise.all(promises).then()
            return chatList.map((x,index)=>{
                let y = x._toFullJSON()
                if(chatDetail[index].length>0){
                y.chatcontent = chatDetail[index][0].get('text') 
                }else{
                    y.chatcontent = null
                }
                return y
            })
        }else{
            return;
        }
 

    },


    // createConversation : async req => {    // Input: user1, user2
    //     let user1 = req.params.user1;
    //     let user2 = req.params.user2;

    //     console.log("crreating")

    //     //var convoRef = firebase.firestore().collection('conversations');

    //     // Add new conversation to the database and return conversation id
    //     try {
    //         let r =  await convoRef.add({
    //             users: [user1, user2],
    //             messages: [],
    //         })
    //         return r.id;

    //     } catch (e) {
    //         return e;
    //     }
    // },

    addMessage : async req => {    // Input: message, conversation id, sender
        let toPointer = Parse.Object.extend('User').createWithoutData(req.params.to)
        let fromPointer = Parse.Object.extend('User').createWithoutData(req.user.id)
        let conversationStatusUser = await new Parse.Query('Conversation').equalTo('user',fromPointer).equalTo('friend',toPointer).find()
        if(conversationStatusUser.length==0){
            let conversation = new Conversation()
            await conversation.set({
                user: fromPointer,
                friend: toPointer,
                chatFrequence: 1,
                status:false

            }).save()
        }else{
        conversationStatusUser[0].increment('chatFrequence').save()
        }
        let conversationStatusFriend =await new  Parse.Query('Conversation').equalTo('user',toPointer).equalTo('friend',fromPointer).find()
        if(conversationStatusUser.length==0){
            let conversation = new Conversation()
            await conversation.set({
                user: toPointer,
                friend: fromPointer,
                chatFrequence: 1,
                status:false

            }).save()
        }else{
        conversationStatusFriend[0].increment('chatFrequence').save()
        }
        let message = new Message()
        await message.set({
            from:fromPointer,
            to:toPointer,
            text:req.params.message          
        }).save()
        return "Message added.";  
    },




    getMyId: async req =>{
        console.log("getmyiddddd",req.user.id)

        return req.user.id

    },


    getMessage: async req => {
        let skipnumber = req.params.number
        let fromPoint = Parse.User.createWithoutData(req.user.id) //我的ID
        let toPoint = Parse.User.createWithoutData(req.params.oppId)  // opposite id
        let chaterList = [fromPoint,toPoint]
        let maxList = await new Parse.Query("Message").containedIn('from',chaterList).containedIn('to',chaterList).find()
        if(maxList.length>skipnumber){
        let messagesList = await new Parse.Query("Message").containedIn('from',chaterList).containedIn('to',chaterList).include('from').include('to').descending('createdAt').skip(skipnumber).limit(10).find()
        let jsonList = messagesList.map(x=>{
            let y =x._toFullJSON()
            y.userId = req.user.id
            return y
        })
        return jsonList.reverse()
    }else{
        let userId = [[req.user.id]]
        return userId
    }



        //let messages = new Parse.Query



        // let conversationId = req.params.conversationId;

        // let convoRef = firebase.firestore().collection('conversations').doc(conversationId);

        // try {
        //     let message = await convoRef.get().then()

        //     let messageList = message.data().messages;
        //     console.log("All messages: ", messageList);
            

        //     return messageList;

        // } catch (e) {
        //     return e;
        // }    
    },

    // keepTracking: async req => {    // Will be activated once new message added to firebase
    //     Parse.LiveQuery.on('open', () => {

    //     });        

    //     let conversationId = req.params.conversationId;

    //     let convoRef = firebase.firestore().collection('conversations').doc(conversationId);

    //     try {

    //         /////////////////////////////////////////////
    //         let observer = convoRef.onSnapshot(docSnapshot => {

    //             // console.log("Updated messages: ", docSnapshot);
    //             console.log("Yes!!!!!!!!!!!");


    //             convoRef.get().then( r => {
    //                 let messageList = r.data().messages;
    //                 console.log("Live messages: ", messageList);

    //                 // Save to live query
    //                 let conversation = new Conversations();
                    
    //                 conversation.set({'msglist' : messageList}).save().then( r => {
    //                     console.log('Save to query: ',r);
    //                 }).catch( e => {
    //                     console.log('Save to query error: ', e);
    //                 });
                    
    //             }).catch( e => {console.log(e)});


    //         }, err => {
    //            console.log(`Encountered error: ${err}`);
    //         });
    //         /////////////////////////////////////////////
 
    //         return "Return!!!";

    //     } catch (e) {
    //         return e;
    //     }    
    // },

}