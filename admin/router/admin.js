const express = require("express");
const Db = require("../modules/Db.js");
const upFile = require("../modules/upFile.js");
const db = new Db("shop");
const router = express.Router();

//获取类别接口
router.get("/type",function(req,res){
	db.find("typeList",{},function(err,result){
		if(err){
			res.send({
				state:"-1",
				code:"数据库连接失败"
			})
		}else{
			res.send({
				state:"1",
				code:"ok",
				data:result
			})
		}
		
	})
})

//文件上传接口
router.post("/upFile",function(req,res){
	upFile.upFile(req,"file",function(config){
		res.send(config);
	})
})

//添加商品接口
router.post("/add",function(req,res){
	let qianduan = req.body;
	qianduan.time = new Date().getTime();
	db.insertOne("goodsList",qianduan,function(err,result){
		res.send({
			state:'1',
			code:"ok"
		})
	})
})

//获取商品接口
router.get("/shop",function(req,res){
	db.find("goodsList",{},function(err,data){
		res.send({
			state:"1",
			code:"ok",
			data:data
		})
	})
})

//删除商品接口
router.post("/del",function(req,res){
	let id = req.body.id;
	db.deleteById("goodsList",id,function(err,data){
		if(err) throw err;
		res.send({
			state:'1',
			code:"ok"
		})
	})
})

//修改商品接口
router.post("/update/:id",function(req,res){
	let obj = req.body;
	let id = req.params.id;
	db.updateById("goodsList",id,obj,function(err,data){
		if(err) throw err;
		res.send({
			state:'1',
			code:"ok"
		})
	})
	
})



module.exports = router;

