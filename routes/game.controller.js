var express = require('express');
var router = express.Router();
var Q = require('q');
var R = require('requestify');
var routerOnlyForAdmin = require('../interceptor/user').routerOnlyForAdmin;
var globalConfig = require('../config');


/**
 * 添加游戏
 */
router.get('/addGame/:id', routerOnlyForAdmin, function(req, res){
	var _channel_id = req.params.id;
	if(!_channel_id || _channel_id.length !== 24){
		res.redirect('back');
		res.end();
		return;
	}
	var rcookies = req.cookies.NODESESSIONID;
	var _getChannelDetail = function(){
		var defer = Q.defer();
		R.request('http://'+globalConfig.host+':'+globalConfig.port+'/api/admin/getChannelDetail',{
			method:'get',
			params:{
				id:_channel_id
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
		res.render('tpl/game/addGame',{
			routerName:'/game/addGame',
			title:'添加游戏',
			channelDetail:_channelDetail
		});
	}
	_getChannelDetail().then(_sendHtml);
});

/**
 * 游戏列表
 */
 router.get('/:id', routerOnlyForAdmin, function(req, res){
 	var _channel_id = req.params.id;
	if(!_channel_id || _channel_id.length !== 24){
		res.redirect('back');
		res.end();
		return;
	}
	var rcookies = req.cookies.NODESESSIONID;
	var _getChannelDetail = function(){
		var defer = Q.defer();
		R.request('http://'+globalConfig.host+':'+globalConfig.port+'/api/admin/getChannelDetail',{
			method:'get',
			params:{
				id:_channel_id
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
		res.render('tpl/game/index',{
			routerName:'/game/index',
			title:'游戏列表',
			channelDetail:_channelDetail
		});
	}
	_getChannelDetail().then(_sendHtml);
 });

module.exports = router;