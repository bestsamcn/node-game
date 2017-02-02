/**
 * user.controller
 * 用户管理模块
 */
var express = require('express');
var router = express.Router();
var Q = require('q');
var R = require('requestify');
var globalConfig = require('../config');
var routerOnlyForAdmin = require('../interceptor/user').routerOnlyForAdmin;
var routerOnlyForLogin = require('../interceptor/user').routerOnlyForLogin;

/**
 * 用户界面
 */
router.get('/', function(req, res, next){
 	var _channel_id = req.session.user._id;
 	var rcookie = req.cookies.NODESESSIONID;
 	var _getDetail = function(){
 		var defer = Q.defer();
 		R.request('http://'+globalConfig.host+':'+globalConfig.port+'/api/admin/getChannelDetail',{
	 		method:'get',
	 		params:{
	 			channelId:_channel_id.toString()
	 		},
	 		cookies:{
	 			NODESESSIONID:rcookie
	 		},
	 		dataType:'json'
	 	}).then(function(res){
	 		var data = JSON.parse(res.body);
	 		defer.resolve(data.data);
	 	},function(){
	 		res.sendStatus(500);
	 		res.end();
	 	});
	 	return defer.promise;
 	}
 	var _sendHtml = function(_channelDetail){
 		res.render('tpl/user/index', {
 			routerName:'/user/index',
 			title:'个人中心',
 			channelDetail:_channelDetail
 		});
 	}
 	_getDetail().then(_sendHtml);
 });

module.exports = router;
