const formidable = require("formidable");
const fs = require("fs");
//file前台传递的文件框的name值；
exports.upFile = function(req,file,callback){
	file = file || "file";//设置前台文件上传的默认字段为file；
//	1、获取form表单对象
	let form = new formidable.IncomingForm();
//	2、设置表单数据字符编码
	form.encoding = "utf-8";
//	3、是否保留扩展名
	form.keepExtensions = true;
//	4、设置文件上传路径
	form.uploadDir = "./upload";
//	5、设置文件上传大小限制
	form.maxFileSize = 2*1024*1024;//2m
//	6、监听上传结果
 	form.parse(req,function(err,options,files){
// 		options为前端form表单中除文件框以外的其他输入框数据
//		files文件框中上传后的文件内容
		console.log(options,files);
		let name = files[file].name;
		let arr = name.split(".");
		let ext = arr[arr.length-1];
		if(ext == "jpg"|| ext == "png"){
			// ./upload/upload_14f85xxxxxxx.png;
			fs.rename(files[file].path,"./upload/"+name,function(err){
				callback({
					state:"1",
					code:"ok",
					fileData:{
						size:files[file].size,
						name:name,
						url:"http://localhost:8080/upload/"+name,
						ext:ext
					},
					options:options
				})
			})
		}else{
			fs.unlink(files[file].path,function(err){
				callback({
					state:"-1",
					code:"文件格式不符"
				})
			})
		}
//		res.send("ok")
 	})
}
