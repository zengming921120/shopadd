const express = require("express");
const Db = require("../modules/Db.js");
const upFile = require("../modules/upFile.js");
const md5 = require("js-md5");
const jwt = require("../modules/jwt.js");
const db = new Db("shop");
const router = express.Router();

//验证用户名是否存在
router.get("/repeat",function(req,res){
	let userName = req.query.userName;
	db.count("userList",{userName:userName},function(err,count){
		if(err) throw err;
		if(count == 0){
			res.send({
				state:1,
				code:"ok"
			})
		}else{
			res.send({
				state:-1,
				code:"用户名已存在"
			})
		}
	})
})
//注册接口
router.post("/rejest",function(req,res){
	let qianduan = req.body;
	db.insertOne("userList",{
		userName:qianduan.userName,
		password:md5(qianduan.password)
	},function(err,data){
		if(err) throw err;
		res.send({
			state:'1',
			code:"ok"
		})
	})
})

//登陆接口
router.post("/login",function(req,res){
	let qianduan = req.body;
	if(qianduan.userName&&qianduan.password){
		
		db.find("userList",{
			query:{userName:qianduan.userName}
		},function(err,data){
			console.log(data)
			if(data.length ==0){
				res.send({
					state:"-2",
					code:'该用户不存在'
				})
			}else{
				if(data[0].password == md5(qianduan.password)){
					res.send({
						state:'1',
						code:'ok',
						data:{
							userID:data[0]._id,
							userName:data[0].userName,
							tokenID:jwt.sign({
								userID:data[0]._id.toString()
							},"7d")
						}
					})
				}else{
					res.send({
						state:"-3",
						code:"用户名与密码不匹配"
					})
				}
			}
			
		})
	
	}else{
		return;
	}
})


module.exports = router;

