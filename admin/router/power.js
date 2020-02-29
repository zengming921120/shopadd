const express = require("express");
const Db = require("../modules/Db.js");
// const upFile = require("../modules/upFile.js");
// const md5 = require("js-md5");
const jwt = require("../modules/jwt.js");
const db = new Db("shop");
const router = express.Router();
//认证
router.use(function(req,res,next){
	// console.log(req.ip);//::1
	let tokenID = req.headers.authorization;
	let userID = "";
	if(req.method.toLowerCase() == "get"){
		userID = req.query.userID;
	}else{
		userID = req.body.userID;
	}
	jwt.verify(tokenID,function(err,data){
		if(err){
			console.log(1)
			res.status(401);
			res.send();
		}else{
			if(data.userID == userID){
				next();
			}else{
				console.log(2)
				res.status(401);
				res.send();
			}
		}
	})
})
//添加至购物车
router.post("/addCar",function(req,res){
	// res.send("ok")
	/*
	* userID,
	* goodsID,
	* count
	*/
   let qianduan = req.body;
   db.count("shopCar",{userID:qianduan.userID,goodsID:qianduan.goodsID},function(err,count){
	   if(count == 0){
		 
			//通过前台发生的商品id  从后台查找商品信息，
			db.findById("goodsList",qianduan.goodsID,function(err,data){
				console.log(data);
				db.insertOne("shopCar",{
				   userID:qianduan.userID,
				   goodsID:qianduan.goodsID,
				   count:1,
				   goodsName:data.goodsName,
				   goodsPrice:data.goodsPrice,
				   goodsType:data.goodsType,
				   typeID:data.typeID,
				   goodsLogo:data.goodsLogo
				},function(err,data){
				   res.send({
					   state:'1',
					   code:"ok"
				   })
				})
			})
	   }else{
		   //查询商品购物车数据，在其购买数量的基础上累加1；
		   db.find("shopCar",{query:{userID:qianduan.userID,goodsID:qianduan.goodsID}},function(err,result){
			   let obj = result[0];
			   let count = obj.count*1;
			   db.updateOne("shopCar",{userID:qianduan.userID,goodsID:qianduan.goodsID},{count:count+1},function(err,data){
				   if(err) throw err;
				   res.send({
					   state:'1',
					   code:"ok"
				   })
			   })
		   })
	   }
   })
})

//获取购物车数据
router.get("/shopCar",function(req,res){
	let qianduan = req.query;
	db.find("shopCar",{query:{
		userID:qianduan.userID
	}},function(err,data){
		if(err) throw err;
		let sum = 0;
		for (let i = 0 ; i < data.length ; i++) {
			sum+=data[i].count*data[i].goodsPrice;
		}
		res.send({
			state:"1",
			code:"ok",
			data:data,
			sum:sum
		})
	})
})

module.exports = router;

