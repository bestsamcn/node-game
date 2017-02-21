/**
 * 管理中心路由
 */
var express = require('express');
var router = express.Router();
var globalConfig = require('../config');
var R = require('requestify');
var Q = require('q');

//权限控制
router.get('*',function(req, res, next){
	if(!req.session.isLogin || req.session.user.userType < 2){
		res.redirect('back');
		res.end();
		return;
	}
	next();
});

/**
 * 首页
 */
router.get('/', function(req, res, next){
	res.render('tpl/admin/index',{
		routerName:'/admin',
		title:'管理后台'
	});
});

/**
 * 添加渠道
 */
router.get('/addChannel', function(req, res, next){
	res.render('tpl/admin/addChannel',{
		routerName:'/admin/addChannel',
		title:'添加渠道'
	});
});

/**
 * 编辑修改渠道
 */
router.get('/editChannel/:channelId', function(req, res, next){
 	if(!req.params.channelId || req.params.channelId.length !== 24){
 		res.redirect('back');
 		return;
 	}
 	var rcookie = req.cookies.NODESESSIONID;
 	var _getDetail = function(){
 		var defer = Q.defer();
 		R.request('http://'+globalConfig.host+':'+globalConfig.port+'/api/admin/getChannelDetail',{
	 		method:'get',
	 		params:{
	 			channelId:req.params.channelId
	 		},
	 		cookies:{
	 			NODESESSIONID:rcookie
	 		},
	 		dataType:'json'
	 	}).then(function(res){
	 		var data = JSON.parse(res.body);
	 		defer.resolve(data);
	 	},function(){
	 		res.render('500');
	 	});
	 	return defer.promise;
 	}
 	var _sendHtml = function(_channelDetail){
 		res.render('tpl/admin/editChannel', {
 			routerName:'/admin/editChannel',
 			title:'编辑渠道',
 			channelDetail:_channelDetail.data
 		});
 	}
 	_getDetail().then(_sendHtml);
 });

/**
 * 修改密码
 */
router.get('/editChannelPassword/:id', function(req, res){
	var _channel_id = req.params.id;
	if(!_channel_id || _channel_id.length !== 24){
		res.redirect('back');
		res.end();
		return;
	}
	var rcookies = req.cookies.NODESESSIONID;
	var _getDetail = function(){
		var defer = Q.defer();
		R.request('http://'+globalConfig.host+':'+globalConfig.port+'/api/admin/getChannelDetail',{
			method:'get',
			params:{
				channelId:_channel_id
			},
			cookies:{
				NODESESSIONID:rcookies
			},
			dataType:'json'
		}).then(function(res){
			var data = JSON.parse(res.body);
			if(data.retCode !== 0){
				res.redirect('back');
				res.end();
				return;
			}
			defer.resolve(data.data);
		},function(){
			res.redirect('back');
			res.end();
		});
		return defer.promise;
	}
	var _sendHtml = function(_channelDetail){
		res.render('tpl/admin/editChannelPassword',{
			routerName:'/admin/editChannelPassword',
			title:'修改密码',
			channelDetail:_channelDetail
		});
	}
	_getDetail().then(_sendHtml);
});
	
module.exports = router;