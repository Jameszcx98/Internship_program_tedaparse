let express = require('express')
let router = express.Router()
var Parse = require('parse/node');
const fs =require('fs');


var multiparty = require('connect-multiparty')
var multipartyMiddleware = new multiparty()


router.use( function timelog(req, res, next){
	console.log( '上传图片' , Date.now())
	next()
})

router.post('/', multipartyMiddleware,  (req,res)  => {
    
	let uploadedImage = req.files['upload-images']
	var sourceStream = fs.createReadStream(uploadedImage.path)
    var destStream = fs.createWriteStream('./temp/'+ uploadedImage.name)
	sourceStream.pipe(destStream)
	
	sourceStream.on('end', function(){
        //删除临时文件
        fs.unlinkSync(uploadedImage.path)
        console.log('Success upload image' + uploadedImage.name)
        //返回给前端的数据，前端会将对应图片地址更新为该服务器地址
        res.end(uploadedImage.name)
    })
    
	
})

module.exports = router