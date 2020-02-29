const express = require("express");
const Db = require("../modules/Db.js");
const upFile = require("../modules/upFile.js");
const db = new Db("shop");
const router = express.Router();

//获取所有商品信息接口
router.get("/goods",function(req,res){
	db.find("goodsList",{},function(err,data){
		if(err) throw err;
		res.send({
			state:'1',
			code:'ok',
			data:data
		})
	})
})


module.exports = router;

