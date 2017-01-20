/**
 * User
 * 用户数据结构
 */
require('../connect');
var mongoose =  require('mongoose');

//用户信息
var UserSchema = new mongoose.Schema({
	account:{
		type:String,
		require:true,
		unique:true
	},
	password:{
		type:String,
		require:true
	},
	avatar:{
		type:String,
		require:false,
		default:'defaultAvatar.png'
	},
	realName:{
		type:String,
		require:false,
		default:''
	},
	mobile:{
		type:String,
		require:false,
		default:'',
	},
	email:{
		type:String,
		require:false,
		default:''
	},
	gender:{
		type:Number,
		require:true,
		default:1
	},
	isActive:{
		type:Number,
		require:true,
		default:0
	},
	createLog:{
		createTime:{
			type:Number,
			require:true
		},
		createIp:{
			type:String,
			require:true
		}
	},
	lastLoginTime:{
		type:Number,
		require:false
	},
	userType:{
		type:Number,
		require:true,
		default:1
	},
	setAdminTime:{
		type:Number,
		require:false
	},
	lastUpdateTime:{
		type:Number,
		require:false
	},
	conpany:{
		type:String,
		require:false
	},
	channel:{
		type:String,
		require:true,
		unique:true
	},
	cooperationMode:{
		type:Number,
		require:true
	}
});

exports = module.exports = UserSchema;


