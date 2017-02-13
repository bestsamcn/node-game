/**
 * home.controller
 * 首页路由控制器管理模块
 */
var express = require('express');
var router = express.Router();
var R = require('requestify');
var Q = require('q');
var globalConfig = require('../config');
/**
 * 如果没有登录不能进入
 */
router.get('*', function(req, res, next){
	if(!req.session.isLogin){
		res.redirect('/sign/signin');
		res.end();
		return;
	}
	next();
})

/**
 * 主页
 */
router.get('/', function(req, res, next) {
	var rcookie = req.cookies.NODESESSIONID;
	var _getMessageCount = function(){
		var defer = Q.defer();
		R.request('http://'+globalConfig.host+':'+globalConfig.port+'/api/message/getUnreadMessageList',{
			method:'get',
			dataType:'json',
			cookies:{
				NODESESSIONID:rcookie
			}
		}).then(function(data){
			//只是body不是json对象
			var rdata = JSON.parse(data.body);
			defer.resolve(rdata.data);
		},function(){
			res.sendStatus(500);
			res.end();
		}); 
		return defer.promise;
	}
	var _sendHtml = function(messageList){
		res.locals.messageList = messageList;
		res.render('tpl/home/index',{
			routerName:'/home',
			title:'主页'
		});
	}
	 
	_getMessageCount().then(_sendHtml);
	
});



module.exports = router;