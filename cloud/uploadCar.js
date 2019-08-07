let Parse = require('parse/node')

// uuid

const q = require('../tools/request')



module.exports = {

    uploadCar: async req => {
        let p = req.params
        console.log("pppppppp: ",p)

        let datestr = p.date
        //var date = new Date(datestr)

        // let timestamp = new Date(datestr)
        // console.log("timestamp:",timestamp)

        let timestamp=new Date(datestr.split(" ")).getTime();
        console.log("timestamp:",timestamp)

        let skuid = "sku-"+p.plate    //用牌照做sku 唯一的

        let name = p.plate

        console.log("p.crashlevel type:",typeof(p.crash))
        console.log("p.superCharged:",p.superCharged)

        let carParams = {
            "product": { 
                "attribute_set_id": 4,
                "type_id": "simple",
                "sku": skuid,
                "name": name,
                "price": p.price,
                "status": 1,
                // "media_gallery_entries": [
                //     {
                //       "label": "",
                //       "position": 0,
                //       "disabled": false,            上传图片 有大小限制 不用这个方法
                //       "types": [
                //         "image",
                //         "small_image",
                //         "thumbnail"
                //       ],
                //       "content": {
                //         "type": "image/png",
                //         "name": "test.png",
                //         "base64_encoded_data": p.base,
                //         // "base64_encoded_data": lpaxsbG3t7e+vr6qqqrFxcWjo6OcnJx35/fKAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADFUlEQVR4nO3az2/TMBjGcXdt0x6pWGmOY5oQR0Bi4pgWIXGkgoodi5B2XgGxKxUa/NvE+enXTVszLd076fs5zU7tPsoS23FqDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHBbs8/r+Prj8r5jBIouRpn42eG/++mowQtjOpu1J5ttisBHTZ081pL3fV0VL/Xn7W2GUp13KioT7Xmjtaj8oz3vQFZOtOd9af+8OV9Gby/Kzx4y77tFIf2Gcfl3kuddSEnWwF4Ov/O2b2ysX+kfvfIjc6fVp1byVtJveuQUbd6mj9nRYVwW7D/n2D26rVULAvP2R87E0S0v4H2tWhCYtyMSpic49o4qy5uOvk/qkh0slgGtWhCYNz2jV3WpVwwQ+1q1IDDvXAZMR4sPAa1aEJh3VUzBhbk43QrzruUFO30Aed3il3zC2NeqBYF5vQHhIeRNnGJ/sdB9v63l+OBRmfeqqX53qxaEj7/HTfW7W7UgfH6bNNXvbtWCwLzpgDD6ubUTfXmHdo3+Y1sn+vJ2s2ed8XlzJ/rymuLx+FvSdPB+80rL/EC1/dC03acwb7eqmJxtdKIwb/5An7tJvE405o1Wdd0kkZ1ozGu6zo7UWHaiMq+Jnte1cu7QmdeYr/PqihCdaM1rzKy8it3lr8b5ohS9zvOKbT3FedP7LjvFyvd3XPl9p3u/RIjsbaf7eV6yk7OznaY+r33ccG849XmHcopTl/fo9PRElOWMoS5vR16vdkM1lod15R16eSPleQf+9oP8mMa88r2a8rx9b8mr/Xo48hYMPeXjg33Bkjhl7eNZ5K14B8rnC7td4g4QU1nUl3de/Qgms77VLH4XAvNOxTPmQP160iasTnC2FaFnve79/iG7z7LtqHEeOFuuK3oe8uSHs82SydmluXy1Uva82Zh36tWKty8K83ZlpTtYqMxrRzSHWF2qzCt+DCVPr8q87gaw3I1Smjeqr4jvXicHzPsfqsBb32tpM7tex3+bXxEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO7UP04luo8JE2YqAAAAAElFTkSuQmCC"
                //       },
                //       "media_type": "image"
                //     }
                // ],
              
                "custom_attributes": [
                    {
                      "attribute_code": "city",
                      "value": p.city
                    },
                    {
                        "attribute_code": "distance",
                        "value": p.distance
                    },
                    {
                        "attribute_code": "plate",
                        "value": p.plate
                    },
                    {
                        "attribute_code": "date",
                        "value": timestamp
                    },
                    {
                        "attribute_code": "crashLevel",
                        "value": p.crash+4  //对齐后台crashLevel的value
                    },
                    {
                        "attribute_code": "scratchLevel",
                        "value": p.appearance+7   //对齐后台scratchLevel的value
                    },
                    {
                        "attribute_code": "burned",
                        "value": p.burned
                    },
                    {
                        "attribute_code": "soaked",
                        "value": p.soaked
                    },
                    {
                        "attribute_code": "emission",
                        "value": p.EmissionStandard+10   //对齐后台EmissionStandard的value
                    },
                    {
                        "attribute_code": "superCharging",
                        "value": p.superCharged
                    }
                  ]

            }
        }
        try{
        console.log("上传的汽车参数：", carParams)
        console.log("date type:",typeof(p.date))
        let response = await q.post('/products', carParams)
        // console.log("responseEEE:",response)
        // console.log("DDDDAte:",p.date)

        // console.log("typeeee:",typeof(p.city))

        return response

        }catch (err){
            console.log(err)
        }

    },

    getChatList : async req =>{
        let r = await new Parse.Query('Message').find()
        console.log("rrrr:",r)
    },

    // showCarList: async req =>{
    //     let attributelist = await q.get('/products/attribute-sets/4/attributes')
    
    //     // console.log("attributelist:",attributelist)
    //     //查询attribute_code == 'brand'的那个对象
    //     let brandlistobj= attributelist.filter(function(item){
    //         return item.attribute_code == "brand"; 
    //     })
    //     let brandlist = brandlistobj[0].options  
    
    //     //console.log("brandlist:",brandlist)
    //     brandlist.shift()
        
    //     console.log("brandlist:",brandlist)
    
    //     return brandlist  //brandlist是一个对象数组 形式如上       
    // }   
}
