/**
 * model/index
 * 数据模型集中管理模块
 */
require('./connect');
var mongoose = require('mongoose');
var UserSchema = require('./schema/User');
var MessageSchema = require('./schema/Message');
var AccessLogSchema = require('./schema/AccessLog');
var CostActiveSchema = require('./schema/Game').CostActiveSchema;
var CostSalesSchema = require('./schema/Game').CostSalesSchema;

//用户模型
exports.UserModel = mongoose.model('User',UserSchema);
exports.MessageModel = mongoose.model('Message',MessageSchema);
exports.AccessLogModel = mongoose.model('AccessLog',AccessLogSchema);

//游戏模型
exports.CostActiveModel = mongoose.model('CostActive',CostActiveSchema);
exports.CostSalesModel = mongoose.model('CostSales',CostSalesSchema);