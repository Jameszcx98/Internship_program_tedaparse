let Parse = require('parse/node');

// uuid

const q = require('../tools/request')


module.exports = {

    uploadCar: async req => {
        let p = req.params
        console.log("pppppppp: ",p)
        let skuid = "sku-"+p.plate    //先用牌照做sku 唯一的

        let name = p.plate
        
        let carParams = {
            "product": { 
                "attribute_set_id": 4,
                "type_id": "simple",
                "sku": skuid,
                "name": name,
                "price": 25,
                "status": 1,
                //下面三个字段先实验
                
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
                        "value": p.date
                    },


                  ]

                // "media_gallery_entries": [
                //     {
                //         "label": "",
                //         "position": 0,
                //         "disabled": false,
                //         "types": [
                //             "image",
                //             "small_image",
                //             "thumbnail"
                //         ],
                //         "content": {
                //             "type": "image/png",
                //             "name": "GN271.png",
                //             "base64_encoded_data": "iVBORw0KGgoAAAANSUhEUgAAAV4AAAEsBAMAAAB578bjAAAAG1BMVEXMzMyWlpaxsbG3t7e+vr6qqqrFxcWjo6OcnJx35/fKAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADFUlEQVR4nO3az2/TMBjGcXdt0x6pWGmOY5oQR0Bi4pgWIXGkgoodi5B2XgGxKxUa/NvE+enXTVszLd076fs5zU7tPsoS23FqDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHBbs8/r+Prj8r5jBIouRpn42eG/++mowQtjOpu1J5ttisBHTZ081pL3fV0VL/Xn7W2GUp13KioT7Xmjtaj8oz3vQFZOtOd9af+8OV9Gby/Kzx4y77tFIf2Gcfl3kuddSEnWwF4Ov/O2b2ysX+kfvfIjc6fVp1byVtJveuQUbd6mj9nRYVwW7D/n2D26rVULAvP2R87E0S0v4H2tWhCYtyMSpic49o4qy5uOvk/qkh0slgGtWhCYNz2jV3WpVwwQ+1q1IDDvXAZMR4sPAa1aEJh3VUzBhbk43QrzruUFO30Aed3il3zC2NeqBYF5vQHhIeRNnGJ/sdB9v63l+OBRmfeqqX53qxaEj7/HTfW7W7UgfH6bNNXvbtWCwLzpgDD6ubUTfXmHdo3+Y1sn+vJ2s2ed8XlzJ/rymuLx+FvSdPB+80rL/EC1/dC03acwb7eqmJxtdKIwb/5An7tJvE405o1Wdd0kkZ1ozGu6zo7UWHaiMq+Jnte1cu7QmdeYr/PqihCdaM1rzKy8it3lr8b5ohS9zvOKbT3FedP7LjvFyvd3XPl9p3u/RIjsbaf7eV6yk7OznaY+r33ccG849XmHcopTl/fo9PRElOWMoS5vR16vdkM1lod15R16eSPleQf+9oP8mMa88r2a8rx9b8mr/Xo48hYMPeXjg33Bkjhl7eNZ5K14B8rnC7td4g4QU1nUl3de/Qgms77VLH4XAvNOxTPmQP160iasTnC2FaFnve79/iG7z7LtqHEeOFuuK3oe8uSHs82SydmluXy1Uva82Zh36tWKty8K83ZlpTtYqMxrRzSHWF2qzCt+DCVPr8q87gaw3I1Smjeqr4jvXicHzPsfqsBb32tpM7tex3+bXxEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO7UP04luo8JE2YqAAAAAElFTkSuQmCC"
                //         },
                //         "media_type": "image"
                //     }
                // ]
            }
        }
        try{
        console.log("上传的汽车参数：", carParams)
        let response = await q.post('/products', carParams)
        // console.log("responseEEE:",response)
        // console.log("DDDDAte:",p.date)

        // console.log("typeeee:",typeof(p.city))

        return response

        }catch (err){
            console.log(err)
        }

    }
}
