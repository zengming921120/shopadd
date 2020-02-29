const express = require("express");
const bodyParser = require("body-parser");
const adminRouter = require("./router/admin.js")
const userRouter = require("./router/user.js")
const indexRouter = require("./router/index.js")
const powerRouter = require("./router/power.js")
const http = express();
http.listen(8080,function(){
	console.log("server Run")
})

http.use(express.static("./www"));

http.use(bodyParser.urlencoded({extended:true}));

//后台管理系统的请求接口
http.use("/admin",adminRouter)
//用户接口路由
http.use("/user",userRouter)
//前台未登录可访问接口
http.use("/index",indexRouter);
//前台未登陆不可访问的接口
http.use("/power",powerRouter)
http.all("*",function(req,res){
	res.sendFile(__dirname+req.url)
})