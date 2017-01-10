require('../connect');
var mongoose = require('mongoose');
var UserSchema = require('./schema').UserSchema;

//用户模型
exports.UserModel = mongoose.model('User',UserSchema);