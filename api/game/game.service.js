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
 * @param {id:String} 特定渠道下的搜索
 * @param {seach:String} 关键词搜索
 * @param {pageIndex:Number} 分页索引,1默认
 * @param {pageSize:Number} 分页长度,10默认
 * @return { retCode:Number, msg:String, data:Object, pageIndex:Number, pageSize:Number, total:Number}; 
 */

var _getGameList = function(req, res, next) {
	var _pageIndex = parseInt(req.query.pageIndex) - 1 || 0,
		_pageSize = parseInt(req.query.pageSize) || 10;
	var _channel_id = req.query.channelId;
	var _mode = req.query.mode || 1;//1-cpa,2-cps
	var _search = req.query.search;//渠道名称|游戏名称
	var _inputDate = req.query.inputDate;
	var _company = req.query.company;
	var filterObj = {};
    
    //如果是指定了渠道id，那么渠道的名的模糊搜索将取消，主要针对用户查询自己的游戏列表
	if(!!_channel_id && _channel_id.length === 24){
		//怪异啊，不能直接赋值，需要重新开内存，才能赋值属性，这个是涉及到关联表的属性查询
		filterObj.channel = {};
		filterObj.channel._id = _channel_id
		if(!!_search){
			var reg =  new RegExp(_search,'gim');
			filterObj.gameName = reg;
		}
	}else{
		//搜索-渠道名-游戏名
		if(!!_search){
			var reg =  new RegExp(_search,'gim');
			// filterObj.$or = [];
			// filterObj.$or[0] = {};
			// filterObj.$or[0].channel = {};
			// filterObj.$or[0].channel.channelName ={$regex:reg};
			// filterObj.$or[1].gameName = {$regex:reg};
			filterObj.$or = [
	    		{'channelName':{$regex:reg}},
	    		{'gameName':{$regex:reg}}
	    	]
		}
	}

    //搜索-日期
    if(!!_inputDate){
    	_inputDate = new Date(_inputDate).getTime();
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

/**
 * @name  /api/game/getGameDetail 获取游戏详情
 * @param {mode:String} 游戏的模式，必需，1-cpa;2-cps
 * @param {gameId:ObjectId} 游戏的id，必需
 * @param {channelId:ObjectId} 渠道的id，普通会员必需，用着检测权限，中间件使用
 */
var _getGameDetail = function(req, res){
 	var _mode = req.query.mode,
 		_game_id = req.query.gameId;
 	if(!_mode || (_mode !== '1' && _mode !== '2')){
 		res.json({retCode:100047, msg:'该游戏不存在', data:null});
 		res.end();
 		return;
 	}
 	if(!_game_id || _game_id.length !== 24){
 		res.json({retCode:100047, msg:'该游戏不存在', data:null});
 		res.end();
 		return;
 	}
 	var _model = _mode === '1' ? CostActiveModel : CostSalesModel;
 	_model.findById(_game_id, function(ferr, fdoc){
 		if(ferr){
 			res.sendStatus(500);
 			res.end();
 			return;
 		}
 		if(!fdoc){
 			req.json({retCode:100047, msg:'该游戏不存在', data:null});
 			res.end();
 			return;
 		}
 		res.json({retCode:0, msg:'查询成功', data:fdoc});
 		res.end();
 	});
}

/**
 * @name  /api/game/editCpaGame 修改游戏
 * @param {gameName:String}  游戏名称
 * @param {installAmount:Number} 安装数
 * @param {singlePrize:Number} 单价
 */
var _editCpaGame = function(req, res){
	var _game_id = req.body.gameId,
		_gameName = req.body.gameName,
		_installAmount = req.body.installAmount,
		_inputDate = req.body.inputDate,
		_singlePrize = req.body.singlePrize;
 	if(!_game_id || _game_id.length !== 24){
 		res.json({retCode:100047, msg:'该游戏不存在', data:null});
 		res.end();
 		return;
 	}
 	if(!_gameName || _gameName.length < 2){
		res.json({retCode:100035, msg:'游戏名称长度不能少于2位', data:null});
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
	if(!_inputDate || _inputDate.length !== 10 || !/^(\d{4})-(\d{2})-(\d{2})$/g.test(_inputDate)){
		res.json({retCode:100045, msg:'日期长度只能为10位,且为yyyy-MM-dd格式', data:null});
		res.end();
		return;
	}
 	//结算金额 = 单价×安装数
	_settlementAmount = (_singlePrize*_installAmount).toFixed(2);
	//日期转换
	_inputDate = new Date(_inputDate).getTime();
 	var obj = {
		gameName:_gameName,
		inputDate:_inputDate,
		installAmount:_installAmount,
		singlePrize:_singlePrize,
		settlementAmount:_settlementAmount,
		lastEditTime:Date.now()
	}
	CostActiveModel.findByIdAndUpdate(_game_id, obj, function(fuerr, fudoc){
		if(fuerr){
			res.sendStatus(500);
			res.end();
			return;
		}
		if(!fudoc){
			res.json({retCode:100048, msg:'游戏修改失败', data:null});
			res.end();
			return;
		}
		res.json({retCode:0, msg:'修改成功', data:fudoc});
	});
}

/**
 * 修改cps游戏
 */
var _editCpsGame = function(req, res){
	var _game_id = req.body.gameId,
		_gameName = req.body.gameName,
		_inputDate = req.body.inputDate,
		_additionUser = req.body.additionUser,
		_splitRatio = req.body.splitRatio;
		_totalStream = req.body.totalStream;
	if(!_game_id || _game_id.length !==24){
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

	//arpu = 总流水/ 新增人数；
	var _ARPU = parseFloat((_totalStream / _additionUser).toFixed(2));
	
	//结算金额 = 总流水×分成比例
	var _settlementAmount = parseFloat((_totalStream * (_splitRatio/100)).toFixed(2));

	//日期转换
	_inputDate = new Date(_inputDate).getTime();

	//修改游戏
	var obj = {
		gameName:_gameName,
		inputDate:_inputDate,
		additionUser:_additionUser,
		settlementAmount:_settlementAmount,
		totalStream:_totalStream,
		splitRatio:_splitRatio,
		arpu:_ARPU,
		lastEditTime:Date.now()
	}
	CostSalesModel.findByIdAndUpdate(_game_id, obj, function(cerr, cdoc){
		if(cerr){
			res.sendStatus(500);
			res.end();
			return;
		}
		if(!cdoc){
			res.json({retCode:100048, msg:'游戏修改失败', data:null});
			res.end();
			return;
		}
		res.json({retCode:0, msg:'修改成功', data:null});
	});
}

/**
 * @name  /api/game/delGame 删除游戏
 * @param {mode:Number} 游戏隶属模式
 * @param {id:ObjectId} 游戏id
 */
var _delGame = function(req, res){
	var _game_id = req.query.gameId,
		_mode = req.query.mode;
	if(!_game_id || _game_id.length !==24){
		res.json({retCode:100039, msg:'无该游戏记录', data:null});
		res.end();
		return;
	}
	if(!_mode || (_mode != 1 && _mode != 2)){
		res.json({retCode:100039, msg:'无该游戏记录', data:null});
		res.end();
		return;
	}
	var _model = _mode === '1' ? CostActiveModel : CostSalesModel;
	_model.findByIdAndRemove(_game_id, function(rerr, rdoc){
		if(rerr){
			res.sendStatus(500);
			res.end();
			return;
		}
		res.json({retCode:0, msg:'删除成功', data:rdoc});
		res.end();
	});
}


exports.addCpaGame = _addCpaGame;
exports.addCpsGame = _addCpsGame;
exports.getGameList = _getGameList;
exports.getGameDetail = _getGameDetail;
exports.editCpaGame = _editCpaGame;
exports.editCpsGame = _editCpsGame;
exports.delGame = _delGame;