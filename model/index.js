/**
 * model/index
 * 数据模型集中管理模块
 */
require('./connect');
var mongoose = require('mongoose');
var UserSchema = require('./schema/User');
var MessageSchema = require('./schema/Message');
var AccessLogSchema = require('./schema/AccessLog');

//用户模型
exports.UserModel = mongoose.model('User',UserSchema);
exports.MessageModel = mongoose.model('Message',MessageSchema);
exports.AccessLogModel = mongoose.model('AccessLog',AccessLogSchema);