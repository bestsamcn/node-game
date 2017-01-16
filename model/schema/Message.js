/**
 * 用户留言数据结构
 */
require('../connect');
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;
 var MessageSchema = new Schema({
 	name:{
 		type:String,
 		require:true
 	},
 	email:{
 		type:String,
 		require:true
 	},
 	content:{
 		type:String,
 		require:true
 	},
 	member:{
 		type:Schema.ObjectId,
 		ref:'User',
 		require:false
 	},
 	isRead:{
 		type:Boolean,
 		default:false,
 		require:true
 	},
 	readTime:{
 		type:Number,
 		require:false
 	},
 	readBody:{
 		type:Schema.ObjectId,
 		ref:'User',
 		require:false
 	},
 	postTime:{
 		type:Number,
 		require:true
 	}
 });
 exports = module.exports = MessageSchema;