var Q = require('q');
var xss = require('xss');
var R = require('requestify');
var UserModel = require('../../model').UserModel;
var CostActiveModel = require('../../model').CostActiveModel;
var CostSalesModel = require('../../model').CostSalesModel;
var $$ = require('../../tools');


/**
 * @name  /api/game/addCpaGame 添加cpa游戏数据
 * @param {gameName:String} 游戏名称 
 * @param {channelName:String} 渠道名称 
 * @param {installAmount:Number} 安装总数
 * @param {singlePrize:Number} 游戏单价
 */
var _addCpaGame = function(req, res){
	var _channel_id = req.body.id,
		_gameName = req.body.gameName,
		_channelName = req.body.channelName,
		_inputDate = req.body.inputDate,
		_installAmount = req.body.installAmount,
		_singlePrize = req.body.singlePrize;
	if(!_channel_id || _channel_id.length !==24){
		res.json({retCode:100034, msg:'无该游戏记录', data:null});
		res.end();
		return;
	}
	if(!_channelName){
		res.json({retCode:100034, msg:'无该游戏记录', data:null});
		res.end();
		return;
	}
	if(!_gameName || _gameName.length < 2){
		res.json({retCode:100035, msg:'游戏名称长度不能少于2位', data:null});
		res.end();
		return;
	}
	if(!_inputDate || _inputDate.length !== 10 || !/^(\d{4})-(\d{2})-(\d{2})$/g.test(_inputDate)){
		res.json({retCode:100045, msg:'日期长度只能为10位,且为yyyy-MM-dd格式', data:null});
		res.end();
		return;
	}
	if(isNaN(_installAmount) || _installAmount< 0){
		res.json({retCode:100046, msg:'游戏安装数只能是数字并不能小于0', data:null});
		res.end();
		return;
	}
	if(isNaN(_singlePrize) || _singlePrize < 0 ){
		res.json({retCode:100036, msg:'游戏单价只能是数字并不能小于0', data:null});
		res.end();
		return;	
	}
	var _createIp = $$.getClientIp(req).match(/\d+\.\d+\.\d+\.\d+/)[0] || '';
	//查询渠道id是否存在
	var _isExistChannel = function(){
		var defer = Q.defer();
		UserModel.findOne({_id:_channel_id}, function(ferr, fdoc){
			if(ferr){
				res.sendStatus(500);
				res.end();
				return;
			}
			if(!fdoc){
				res.json({retCode:100037, msg:'无该渠道记录', data:null});
				res.end();
				return;
			}
			defer.resolve();
		});
		return defer.promise;
	}
	//结算金额 = 单价×安装数
	_settlementAmount = (_singlePrize*_installAmount).toFixed(2);
	//日期转换
	_inputDate = new Date(_inputDate).getTime();
	//添加游戏
	var _addModel = function(){
		var obj = {
			channel:_channel_id,
			createBy:req.session.user._id,
			gameName:_gameName,
			channelName:_channelName,
			inputDate:_inputDate,
			installAmount:_installAmount,
			singlePrize:_singlePrize,
			settlementAmount:_settlementAmount,
			createTime:Date.now(),
			createIp:_createIp
		}
		CostActiveModel.create(obj, function(cerr, cdoc){
			if(cerr){
				res.sendStatus(500);
				res.end();
				return;
			}
			if(!cdoc){
				res.json({retCode:100038, msg:'创建失败', data:null});
				res.end();
				return;
			}
			res.json({retCode:0, msg:'创建成功', data:null});
		});
	}
	_isExistChannel().then(_addModel);
}


/**
 * @name  /api/game/addCpsGame 添加cps游戏数据
 * @param {gameName:String} 游戏名称 
 * @param {inputDate:String} 用户指定日期 
 * @param {additionUser:Number} 新增用户数
 * @param {splitRatio:String} 合成比例
 * @param {totalStream:Number} 总流水
 */
var _addCpsGame = function(req, res){
	var _channel_id = req.body.id,
		_gameName = req.body.gameName,
		_channelName = req.body.channelName,
		_inputDate = req.body.inputDate,
		_additionUser = req.body.additionUser,
		_splitRatio = req.body.splitRatio;
		_totalStream = req.body.totalStream;
	if(!_channel_id || _channel_id.length !==24){
		res.json({retCode:100039, msg:'无该游戏记录', data:null});
		res.end();
		return;
	}
	if(!_channelName){
		res.json({retCode:100039, msg:'无该游戏记录', data:null});
		res.end();
		return;
	}
	if(!_gameName || _gameName.length < 2){
		res.json({retCode:100040, msg:'游戏名称长度不能少于2位', data:null});
		res.end();
		return;
	}
	if(!_inputDate || _inputDate.length < 10 || !/^(\d{4})-(\d{2})-(\d{2})$/g.test(_inputDate)){
		res.json({retCode:100045, msg:'日期长度只能为10位,且为yyyy-MM-dd格式', data:null});
		res.end();
		return;
	}
	if(!_additionUser || isNaN(_additionUser) || _additionUser< 0){
		res.json({retCode:100041, msg:'新增用户不能小于0', data:null});
		res.end();
		return;
	}
	if(!_splitRatio || _splitRatio < 0 || _splitRatio >100){
		res.json({retCode:100042, msg:'分成比例长度不能小于0或者大于100', data:null});
		res.end();
		return;
	}
	if(!_totalStream || isNaN(_totalStream) || _totalStream < 0 ){
		res.json({retCode:100043, msg:'总流水不能小于0', data:null});
		res.end();
		return;	
	}

	var _createIp = $$.getClientIp(req).match(/\d+\.\d+\.\d+\.\d+/)[0] || '';
	//查询渠道id是否存在
	var _isExistChannel = function(){
		var defer = Q.defer();
		UserModel.findOne({_id:_channel_id}, function(ferr, fdoc){

			if(ferr){
				res.sendStatus(500);
				res.end();
				return;
			}
			if(!fdoc){
				res.json({retCode:100044, msg:'无该渠道记录', data:null});
				res.end();
				return;
			}

			defer.resolve();
		});
		return defer.promise;
	}
	//arpu = 总流水/ 新增人数；
	//结算金额 = 总流水×分成比例
	var _ARPU = parseFloat((_totalStream / _additionUser).toFixed(2));

	var _settlementAmount = parseFloat((_totalStream * (_splitRatio/100)).toFixed(2));

	//日期转换
	_inputDate = new Date(_inputDate).getTime();

	//添加游戏
	var _addModel = function(){
		var obj = {
			channel:_channel_id,
			createBy:req.session.user._id,
			gameName:_gameName,
			channelName:_channelName,
			inputDate:_inputDate,
			additionUser:_additionUser,
			settlementAmount:_settlementAmount,
			totalStream:_totalStream,
			splitRatio:_splitRatio,
			arpu:_ARPU,
			createTime:Date.now(),
			createIp:_createIp
		}
		CostSalesModel.create(obj, function(cerr, cdoc){
			if(cerr){
				res.sendStatus(500);
				res.end();
				return;
			}
			if(!cdoc){
				res.json({retCode:100038, msg:'创建失败', data:null});
				res.end();
				return;
			}
			res.json({retCode:0, msg:'创建成功', data:null});
		});
	}
	_isExistChannel().then(_addModel);
}

/**
 * @name  /api/game/getCpaGameList 获取游戏列表
 * @type {get}
 * @param {seach:String} 关键词搜索
 * @param {pageIndex:Number} 分页索引,1默认
 * @param {pageSize:Number} 分页长度,10默认
 * @return { retCode:Number, msg:String, data:Object, pageIndex:Number, pageSize:Number, total:Number}; 
 */

var _getGameList = function(req, res, next) {
	var _pageIndex = parseInt(req.query.pageIndex) - 1 || 0,
		_pageSize = parseInt(req.query.pageSize) || 10;
	var _mode = req.query.mode || 1;//1-cpa,2-cps
	var _search = req.query.search;//渠道名称|游戏名称
	var _inputDate = req.query.inputDate;
	var _company = req.query.company;
	var filterObj = {};


    //搜索-渠道名-游戏名
    if(!!_search){
    	var reg =  new RegExp(_search,'gim');
    	filterObj.$or = [
    		{'channelName':{$regex:reg}},
    		{'gameName':{$regex:reg}}
    	]
    
    }

    //搜索-日期
    if(!!_inputDate){
    	filterObj.inputDate = _inputDate;
    	
    }

    //搜索-公司
    if(!!_company){
    	filterObj.company = _company;
    }
    //搜索-模式cpa cps
    var _model = _mode === '1' ? CostActiveModel : CostSalesModel;

	//获取分页数据
	var _getList = function() {
		var defer = Q.defer();
		_model.find(filterObj).populate('channel').sort({
			'createLog.createTime': -1
		}).skip(_pageIndex * _pageSize).limit(_pageSize).exec(function(ferr, flist) {
			if (ferr) {
				res.sendStatus(500);
				res.end();
				return;
			}
			var obj = {
				pageIndex: _pageIndex,
				pageSize: _pageSize,
				flist: flist
			}
			defer.resolve(obj);
		});
		return defer.promise;
	}
	//计算记录总数
	var _getTotal = function(obj) {
		_model.count(filterObj, function(cerr, ctotal) {
			if (cerr) {
				res.sendStatus(500);
				res.end();
				return;
			}
			res.json({
				retCode: 0,
				msg: '查询成功',
				data: obj.flist,
				pageIndex: obj.pageIndex + 1,
				pageSize: obj.pageSize,
				total: ctotal
			});
			res.end();
		});
	}
	_getList().then(_getTotal);
}

exports.addCpaGame = _addCpaGame;
exports.addCpsGame = _addCpsGame;
exports.getGameList = _getGameList;