/**
 * 管理员服务
 */
var Q = require('q');
var xss = require('xss');
var UserModel = require('../../model').UserModel;
var crypto = require('crypto');
var $$ = require('../../tools');

var _addChannel = function(req, res){
	var _company = req.body.company,
		_channel = req.body.channel,
		_mode = req.body.mode,
		_account = req.body.account,
		_password = req.body.password;

	if(_company && _company.length < 2){
		res.json({retCode:100018, msg:'公司名长度不能少于2位', data:null});
		res.end();
		return;
	}
	if(!_channel || _channel.length < 2){
		res.json({retCode:100019, msg:'渠道名称长度不能少于2位', data:null});
		res.end();
		return;
	}
	if(!_mode || _mode.length !== 1){
		res.json({retCode:100020, msg:'合作模式长度不能为空', data:null});
		res.end();
		return;
	}
	if(!_account || _account.length < 2){
		res.json({retCode:100021, msg:'用户名长度不能少于2位', data:null});
		res.end();
		return;
	}
	if(!_password || _password.length < 6){
		res.json({retCode:100022, msg:'密码长度不能少于6', data:null});
		res.end();
		return;
	}
	//检测用户名是否重复
	var _isNotExistAccount = function(){
		var defer = Q.defer();
		UserModel.findOne({account:_account},function(ferr, fdoc){
			if(ferr){
				res.sendStatus(500);
				res.end();
				return;
			}
			if(fdoc){
				res.json({retCode:100023, msg:'用户名重复', data:null});
				res.end();
				return;
			}
			defer.resolve();
		})
		return defer.promise;
	}
	//检测渠道名是否重复
	var _isNotExistChannel = function(){
		var defer = Q.defer();
		UserModel.findOne({channel:_channel}, function(ferr, fdoc){
			if(ferr){
				res.sendStatus(500);
				res.end();
				return;
			}
			if(fdoc){
				res.json({retCode:100024, msg:'渠道名称重复', data:null});
				res.end();
				return;
			}
			defer.resolve();
		});
		return defer.promise;
	}
	//创建渠道
	var _createChannel = function(){
		
		var md5 = crypto.createHash('md5');
		_password = md5.update(_password).digest('hex');

		var _createIp = $$.getClientIp(req).match(/\d+\.\d+\.\d+\.\d+/)[0] || '';
		var entity = {
			account:_account,
			password:_password,
			createLog:{
				createTime:Date.now(),
				createIp:_createIp
			},
			company:_company,
			channel:_channel,
			mode:_mode
		}
		UserModel.create(entity, function(cerr, cdoc){
			console.log(cerr, cdoc)
			if(cerr || !cdoc){
				res.sendStatus(500);
				res.end();
				return;
			}
			res.json({retCode:0, msg:'渠道创建成功', data:null});
			res.end();
		});
	}
	_isNotExistAccount().then(_isNotExistChannel).then(_createChannel);
}

/**
 * @name  /api/admin/getChannelList 获取渠道（用户）列表
 * @params {seach:String} 关键词搜索
 * @params {mode:Number} 合作模式有CPA,CPS,参数分别是1,2,默认是1
 * @params {pageIndex:Number} 分页索引,1默认
 * @params {pageSize:Number} 分页长度,10默认
 * @return { retCode:Number, msg:String, data:Object, pageIndex:Number, pageSize:Number, total:Number}; 
 */
var _getChannelList = function(req, res, next) {
	var _pageIndex = parseInt(req.query.pageIndex) - 1 || 0,
		_pageSize = parseInt(req.query.pageSize) || 10;
	var _mode = req.query.mode;
	var _search = req.query.search;
	var filterObj = {};
	filterObj.userType = 1;

	//过滤
	if(typeof _mode){
		if(_mode === '1'){
			filterObj.mode = 1;
		}else if(_mode === '2'){
			filterObj.mode = 2;
		}
	}

    //搜索
    if(typeof _search){
    	filterObj.channel = new RegExp(_search,'gim');
    }

	//获取分页数据
	var _getList = function() {
			var defer = Q.defer();
			UserModel.find(filterObj).sort({
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
		UserModel.count(filterObj, function(cerr, ctotal) {
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


exports.addChannel = _addChannel;
exports.getChannelList = _getChannelList;
