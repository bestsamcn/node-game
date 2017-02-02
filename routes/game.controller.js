var express = require('express');
var router = express.Router();
var Q = require('q');
var R = require('requestify');
var routerOnlyForAdmin = require('../interceptor/user').routerOnlyForAdmin;
var globalConfig = require('../config');


/**
 * 添加游戏
 */
router.get('/addGame/:channelId', routerOnlyForAdmin, function(req, res){
	var _channel_id = req.params.channelId;
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
				channelId:_channel_id
			},
			cookies:{
				NODESESSIONID:rcookies
			},
			dataType:'json'
		}).then(function(rdata){
			var data = JSON.parse(rdata.body);
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
 router.get('/:channelId', routerOnlyForAdmin, function(req, res){
 	var _channel_id = req.params.channelId;
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
				channelId:_channel_id
			},
			cookies:{
				NODESESSIONID:rcookies
			},
			dataType:'json'
		}).then(function(rdata){
			var data = JSON.parse(rdata.body);
			console.log(data,'fffffffffffff')
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

/**
 * 游戏编辑
 * @param  { mode:String } 模式标识
 * @param  { id:String } 游戏id
 */
router.get('/editGame/:mode/:id', routerOnlyForAdmin, function(req, res){
	var _game_mode = req.params.mode;
 	var _game_id = req.params.id;
 	if(!_game_mode || (_game_mode !== '1' && _game_mode !== '2')){
		res.redirect('back');
		res.end();
		return;
	}
	if(!_game_id || _game_id.length !== 24){
		res.redirect('back');
		res.end();
		return;
	}
	var rcookies = req.cookies.NODESESSIONID;
	var _getGameDetail = function(){
		var defer = Q.defer();
		R.request('http://'+globalConfig.host+':'+globalConfig.port+'/api/game/getGameDetail',{
			method:'get',
			params:{
				mode:_game_mode,
				gameId:_game_id
			},
			cookies:{
				NODESESSIONID:rcookies
			},
			dataType:'json'
		}).then(function(rdata){
			var data = JSON.parse(rdata.body);
			if(data.retCode !== 0){
				res.redirect('back');
				res.end();
				return;
			}
			data.data.mode = _game_mode;
			defer.resolve(data.data);
		},function(){
			res.redirect('back');
			res.end();
		});
		return defer.promise;
	}
	var _sendHtml = function(_gameDetail){
		res.render('tpl/game/editGame',{
			routerName:'/game/editGame',
			title:'修改游戏',
			gameDetail:_gameDetail
		});
	}
	_getGameDetail().then(_sendHtml);
});

module.exports = router;