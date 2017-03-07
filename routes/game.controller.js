var express = require('express');
var router = express.Router();
var Q = require('q');
var R = require('requestify');
var routerOnlyForAdmin = require('../interceptor/user').routerOnlyForAdmin;
var globalConfig = require('../config');
var dateFormat = require('../tools').dateFormat;
var generateArray = require('../tools').generateArray;
var nodeExcel = require('excel-export');
var fs = require('fs');


/**
 * 添加游戏
 */
router.get('/addGame/:channelId', routerOnlyForAdmin, function(req, res) {
	var _channel_id = req.params.channelId;
	if (!_channel_id || _channel_id.length !== 24) {
		res.redirect('back');
		res.end();
		return;
	}
	var rcookies = req.cookies.NODESESSIONID;
	var _getChannelDetail = function() {
		var defer = Q.defer();
		R.request('http://' + globalConfig.host + ':' + globalConfig.port + '/api/admin/getChannelDetail', {
			method: 'get',
			params: {
				channelId: _channel_id
			},
			cookies: {
				NODESESSIONID: rcookies
			},
			dataType: 'json'
		}).then(function(rdata) {
			var data = JSON.parse(rdata.body);
			if (data.retCode !== 0) {
				res.redirect('back');
				res.end();
				return;
			}
			defer.resolve(data.data);
		}, function() {
			res.redirect('back');
			res.end();
		});
		return defer.promise;
	}
	var _sendHtml = function(_channelDetail) {
		res.render('tpl/game/addGame', {
			routerName: '/game/addGame',
			title: '添加游戏',
			channelDetail: _channelDetail
		});
	}
	_getChannelDetail().then(_sendHtml);
});

/**
 * 游戏列表
 */
router.get('/:channelId', routerOnlyForAdmin, function(req, res) {
	var _channel_id = req.params.channelId;
	if (!_channel_id || _channel_id.length !== 24) {
		res.redirect('back');
		res.end();
		return;
	}
	var rcookies = req.cookies.NODESESSIONID;
	var _getChannelDetail = function() {
		var defer = Q.defer();
		R.request('http://' + globalConfig.host + ':' + globalConfig.port + '/api/admin/getChannelDetail', {
			method: 'get',
			params: {
				channelId: _channel_id
			},
			cookies: {
				NODESESSIONID: rcookies
			},
			dataType: 'json'
		}).then(function(rdata) {
			var data = JSON.parse(rdata.body);
			if (data.retCode !== 0) {
				res.redirect('back');
				res.end();
				return;
			}
			defer.resolve(data.data);
		}, function() {
			res.redirect('back');
			res.end();
		});
		return defer.promise;
	}
	var _sendHtml = function(_channelDetail) {
		res.render('tpl/game/index', {
			routerName: '/game/index',
			title: '游戏列表',
			channelDetail: _channelDetail
		});
	}
	_getChannelDetail().then(_sendHtml);
});

/**
 * 游戏编辑
 * @param  { mode:String } 模式标识
 * @param  { id:String } 游戏id
 */
router.get('/editGame/:mode/:id', routerOnlyForAdmin, function(req, res) {
	var _game_mode = req.params.mode;
	var _game_id = req.params.id;
	if (!_game_mode || (_game_mode !== '1' && _game_mode !== '2')) {
		res.redirect('back');
		res.end();
		return;
	}
	if (!_game_id || _game_id.length !== 24) {
		res.redirect('back');
		res.end();
		return;
	}
	var rcookies = req.cookies.NODESESSIONID;
	var _getGameDetail = function() {
		var defer = Q.defer();
		R.request('http://' + globalConfig.host + ':' + globalConfig.port + '/api/game/getGameDetail', {
			method: 'get',
			params: {
				mode: _game_mode,
				gameId: _game_id
			},
			cookies: {
				NODESESSIONID: rcookies
			},
			dataType: 'json'
		}).then(function(rdata) {
			var data = JSON.parse(rdata.body);
			if (data.retCode !== 0) {
				res.redirect('back');
				res.end();
				return;
			}
			data.data.mode = _game_mode;
			defer.resolve(data.data);
		}, function() {
			res.redirect('back');
			res.end();
		});
		return defer.promise;
	}
	var _sendHtml = function(_gameDetail) {
		res.render('tpl/game/editGame', {
			routerName: '/game/editGame',
			title: '修改游戏',
			gameDetail: _gameDetail
		});
	}
	_getGameDetail().then(_sendHtml);
});


/**
 * 下载excel
 * @param {channelId:String} 特定渠道下的搜索
 * @param {seach:String} 关键词搜索
 * @param {pageIndex:Number} 分页索引,1默认
 * @param {pageSize:Number} 分页长度,10默认,如果等于-1，则返回全部
 * @param {startDate:Date} 开始日期 2017-02-14
 * @param {endDate:Date} 结束日期日期 2017-02-14
 * @return startDate_endDate.xlsx
 */
router.get('/download/:channelId', function(req, res, next) {
	var _channel_id = req.params.channelId;
	var _channelId = req.query.channelId,
		_mode = req.query.mode,
		_search = req.query.search,
		_pageIndex = req.query.pageIndex,
		_pageSize = req.query.pageSize,
		_startDate = req.query.startDate,
		_company = req.query.company,
		_endDate = req.query.endDate;
	if (_channel_id !== _channelId || !_channelId || _channelId.length !== 24 || (_mode !== '1' && _mode !== '2')) {
		res.render('404');
	}
	_search = !!_search ? decodeURI(_search) : null;
	var filedir = 'public/files/';
	var fileName = '';
	if (!_startDate || !_endDate) {

		fileName = dateFormat(new Date().getTime(), 'yyyy-MM-dd');
	} else {

		fileName = _startDate + '_' + _endDate;
	}
	var conf = {};
	var cpaCols = [
		{
			caption: '渠道名',
			type: 'string',
			width: 20
		}, {
			caption: '游戏名',
			type: 'string',
			width: 20
		}, {
			caption: '日期',
			type: 'string',
			width: 20,
			beforeCellWrite:function(row, cellData){
               return dateFormat(cellData,'yyyy-MM-dd');
        	}
		}, {
			caption: '结算金额',
			type: 'number',
			width: 20
		}, {
			caption: '单价',
			type: 'number',
			width: 20
		}, {
			caption: '安装数',
			type: 'number',
			width: 20
		}
	];
	var cpsCols = [
		{
			caption: '渠道名',
			type: 'string',
			width: 20
		}, {
			caption: '游戏名',
			type: 'string',
			width: 20
		}, {
			caption: '日期',
			type: 'string',
			width: 20,
			beforeCellWrite:function(row, cellData){
               return dateFormat(cellData,'yyyy-MM-dd');
        	}
		}, {
			caption: '新增用户',
			type: 'number',
			width: 20
		}, {
			caption: '分成比例',
			type: 'number',
			width: 20
		}, {
			caption: 'ARPU',
			type: 'number',
			width: 20
		}, {
			caption: '结算金额',
			type: 'number',
			width: 20
		}, {
			caption: '总流水',
			type: 'number',
			width: 20
		}
	]

	conf.cols = _mode == 1 ? cpaCols : cpsCols;
	var rcookies = req.cookies.NODESESSIONID;
	//获取数据
	var _getGameList = function() {
		var defer = Q.defer();
		R.request('http://' + globalConfig.host + ':' + globalConfig.port + '/api/game/getGameList', {
			method: 'get',
			params: {
				mode: _mode,
				channelId:_channelId,
				search:_search,
				pageIndex:_pageIndex,
				pageSize:_pageSize,
				startDate:_startDate,
			    endDate:_endDate,
			    company:_company
			},
			cookies: {
				NODESESSIONID: rcookies
			},
			dataType: 'json'
		}).then(function(rdata) {
			var data = JSON.parse(rdata.body);
			if (data.retCode !== 0 || data.data.length === 0) {
				res.render('404');
			}
			defer.resolve(data.data);
		}, function() {
			res.render('404');
		});
		return defer.promise;
	}
	//生成xlsx文件
	var _generateXlsx = function(game){
		var hideElementArr = ['_id','__v','channel','createBy','createTime','createIp','pinYin'];
		// conf.name = game[0].channelName+fileName;
		conf.rows = generateArray(game, hideElementArr);
		var result = nodeExcel.execute(conf);
        fileName = game[0].channelName+fileName;
		var filePath = filedir + fileName + '.xlsx';
		fs.writeFile(filePath, result, 'binary', function(err) {
			if (err) {
				res.render('500');
			}
			res.download(filePath);
		});
	}
	_getGameList().then(_generateXlsx);
});


module.exports = router;