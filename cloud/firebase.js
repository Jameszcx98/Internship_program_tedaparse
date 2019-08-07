let Parse = require('parse/node')
var ParseServer = require('parse-server').ParseServer;
// 导入Firebase
let firebase = require("firebase/app")
require("firebase/firestore")

// Init conversation live query class
let Conversations = Parse.Object.extend('Conversations');
let Message = Parse.Object.extend('Message')



module.exports = {
    getChatList : async req =>{

        let hostId = 'b7n8SBW7gg'   //先写死看看
        let oppId = 'WyyKaMWhab'

        let r = await new Parse.Query(Message).equalTo('to',oppId).find()
        console.log("rrrr:",r)




        return r    

    },


    createConversation : async req => {    // Input: user1, user2
        let user1 = req.params.user1;
        let user2 = req.params.user2;

        var convoRef = firebase.firestore().collection('conversations');

        // Add new conversation to the database and return conversation id
        try {
            let r =  await convoRef.add({
                users: [user1, user2],
                messages: [],
            })
            return r.id;

        } catch (e) {
            return e;
        }
    },

    addMessage : async req => {    // Input: message, conversation id, sender
        let p = req.params
        console.log("ppp:",p)

        let toIdPointer = Parse.Object.extend('User').createWithoutData(p.to)
        let fromIdPointer = Parse.Object.extend('User').createWithoutData(p.from)
       
        // let msg = req.params.message;
        // let conversationId = req.params.conversationId;
        // let sdr = req.params.sender;
        console.log("p.to",p.to)
        let message = new Message()
        await message.set({
            to:toIdPointer,
            from:fromIdPointer,
            text:p.message          
        }).save()

        return "Message added.";

       // console.log('sdr:',sdr)


        

        //let convoRef = firebase.firestore().collection('conversations').doc(conversationId);

        // let getMessage = convoRef.get().then( doc => {
        //     let messageList = doc.data().messages;
        //     messageList.push({
        //         time : Date(Date.now()).toString(),
        //         sender : sdr,
        //         message : msg
        //     });
        //     // console.log("New messages list: ", messageList);

        //     // Set the new messageList
        //     let updateSingle = convoRef.update({messages: messageList});
        //})
        // .catch( e => {
        //     console.log("Error adding message: ", e);
        // })

        
    },

    getMessage: async req => {
        let conversationId = req.params.conversationId;

        let convoRef = firebase.firestore().collection('conversations').doc(conversationId);

        try {
            let message = await convoRef.get().then()

            let messageList = message.data().messages;
            console.log("All messages: ", messageList);
            

            return messageList;

        } catch (e) {
            return e;
        }    
    },

    keepTracking: async req => {    // Will be activated once new message added to firebase
        Parse.LiveQuery.on('open', () => {

        });        

        let conversationId = req.params.conversationId;

        let convoRef = firebase.firestore().collection('conversations').doc(conversationId);

        try {

            /////////////////////////////////////////////
            let observer = convoRef.onSnapshot(docSnapshot => {

                // console.log("Updated messages: ", docSnapshot);
                console.log("Yes!!!!!!!!!!!");


                convoRef.get().then( r => {
                    let messageList = r.data().messages;
                    console.log("Live messages: ", messageList);

                    // Save to live query
                    let conversation = new Conversations();
                    
                    conversation.set({'msglist' : messageList}).save().then( r => {
                        console.log('Save to query: ',r);
                    }).catch( e => {
                        console.log('Save to query error: ', e);
                    });
                    
                }).catch( e => {console.log(e)});


            }, err => {
               console.log(`Encountered error: ${err}`);
            });
            /////////////////////////////////////////////
 
            return "Return!!!";

        } catch (e) {
            return e;
        }    
    },

}