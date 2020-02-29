const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const url = "mongodb://localhost:27017";

//创建Db构造函数
function Db (name){
	this.name = name;//指定数据库名称
	this.connect = function(callback){
		let that = this;
		MongoClient.connect(url,{useNewUrlParser: true},function(err,dbase){
			if(err) throw err;
			let db = dbase.db(that.name)
			callback(db)
		})
	}
}
Db.prototype = {
	constructor:Db,
	/*
	*	collectionName:指定操作集合
	*   data:插入的数据（object类型数据）
	*   backFn:插入完成后的回调函数
	* 		err:插入失败的错误原因
	* 		result:反馈结果
	*/
	insertOne:function(collectionName,data,backFn){
		this.connect(function(db){
			db.collection(collectionName).insertOne(data,backFn)
		})
	},
	/*
	*	collectionName:指定操作集合
	*   arr:插入的数据（Array类型数据）
	*   backFn:插入完成后的回调函数
	* 		err:插入失败的错误原因
	* 		result:反馈结果
	*/
	insertMany:function(collectionName,arr,backFn){
		this.connect(function(db){
			db.collection(collectionName).insertMany(arr,backFn)
		})
	},
	/*
	*	collectionName:指定操作集合
	*   query:匹配规则（object）
	*   backFn:删除完成后的回调函数
	* 		err:删除失败的错误原因
	* 		result:反馈结果
	*/
	deleteOne:function(collectionName,query,backFn){
		this.connect(function(db){
			db.collection(collectionName).deleteOne(query,backFn)
		})
	},
	/*
	*	collectionName:指定操作集合
	*   query:匹配规则（object）
	*   backFn:删除完成后的回调函数
	* 		err:删除失败的错误原因
	* 		result:反馈结果
	*/
	deleteMany:function(collectionName,query,backFn){
		this.connect(function(db){
			db.collection(collectionName).deleteMany(query,backFn)
		})
	},
	/*
	*	collectionName:指定操作集合
	*   id:被删除项的_id值（string）
	*   backFn:删除完成后的回调函数
	* 		err:删除失败的错误原因
	* 		result:反馈结果
	*/
	deleteById:function(collectionName,id,backFn){
		this.connect(function(db){
			db.collection(collectionName).deleteOne({_id:ObjectId(id)},backFn)
		})
	},
	/*
	*	collectionName:指定操作集合
	*   query:匹配规则（object）
	* 	update:更新后的数据（object）
	*   backFn:更新完成后的回调函数
	* 		err:更新失败的错误原因
	* 		result:反馈结果
	*/
	updateOne:function(collectionName,query,update,backFn){
		this.connect(function(db){
			db.collection(collectionName).updateOne(query,{$set:update},backFn)
		})
	},
	/*
	*	collectionName:指定操作集合
	*   query:匹配规则（object）
	* 	update:更新后的数据（object）
	*   backFn:更新完成后的回调函数
	* 		err:更新失败的错误原因
	* 		result:反馈结果
	*/
	updateMany:function(collectionName,query,update,backFn){
		this.connect(function(db){
			db.collection(collectionName).updateMany(query,{$set:update},backFn)
		})
	},
	/*
	*	collectionName:指定操作集合
	*   id:匹配项的_id（string）
	* 	update:更新后的数据（object）
	*   backFn:更新完成后的回调函数
	* 		err:更新失败的错误原因
	* 		result:反馈结果
	*/
	updateById:function(collectionName,id,update,backFn){
		this.connect(function(db){
			db.collection(collectionName).updateOne({_id:ObjectId(id)},{$set:update},backFn)
		})
	},
	/*
	*	collectionName:指定操作集合
	*   id:匹配项_id（string）
	*   backFn:更新完成后的回调函数
	* 		err:更新失败的错误原因
	* 		result:反馈结果
	*/
	findById:function(collectionName,id,backFn){
		this.connect(function(db){
			db.collection(collectionName).find({_id:ObjectId(id)}).toArray(function(err,result){
				backFn(err,result[0])
			})
		})
	},
	/*
	*	collectionName:指定操作集合
	*   obj:{
				query:查询条件(Object),
				skip:跳过多少条数据(number),
				limit:返回多少条数据(number)
		}
	*   backFn:更新完成后的回调函数
	* 		err:更新失败的错误原因
	* 		result:反馈结果
	*/
	find:function(collectionName,obj,backFn){
// 		obj{
// 			query:查询对象,
// 			skip:跳过多少条数据,
// 			limit:查询几条
// 		}
		obj.query = obj.query || {};
		obj.skip = obj.skip || 0;
		obj.limit = obj.limit || 0;
		this.connect(function(db){
			db.collection(collectionName).find(obj.query).skip(obj.skip).limit(obj.limit).toArray(backFn)
		})
	},
	/*
	*	collectionName:指定操作集合
	*   query:匹配规则（object）
	*   backFn:更新完成后的回调函数
	* 		err:更新失败的错误原因
	* 		count:反馈结果为数字（number）
	*/
	count:function(collectionName,query,backFn){
		this.connect(function(db){
			db.collection(collectionName).count(query,backFn)
		})
	}
}

module.exports = Db;