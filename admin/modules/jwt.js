const jwt = require("jsonwebtoken");
const key = "123123";
module.exports = {
	sign:function(content,exp){
		return jwt.sign(content,key,{expiresIn:exp});
	},
	verify:function(token,callback){
		jwt.verify(token,key,callback)
	}
}