/**
 * 管理员服务
 */
var Q = require('q');
var xss = require('xss');
var UserModel = require('../../model').UserModel;
var CostActiveModel = require('../../model').CostActiveModel;
var CostSalesModel = require('../../model').CostSalesModel;
var crypto = require('crypto');
var $$ = require('../../tools');


/**
 * @name  /api/admin/addChannel 添加新渠道
 * @type {post}
 * @param {company:String} 公司名称，当不为空的时候检验
 * @param {channelName:String} 渠道名称
 * @param {mode:Number} 合作模式，1，2分别代码CPA,CPS
 * @param {account:String} 用户名
 * @param {password:String} 密码 
 * @return {retCode:Number, msg:String, data:null} [description]
 */
var _addChannel = function(req, res){
	var _company = req.body.company,
		_channelName = req.body.channelName,
		_mode = req.body.mode,
		_account = req.body.account,
		_password = req.body.password;
	if(_company && _company.length < 2){
		res.json({retCode:100018, msg:'公司名长度不能少于2位', data:null});
		res.end();
		return;
	}
	if(!_channelName || _channelName.length < 2){
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
		UserModel.findOne({channelName:_channelName}, function(ferr, fdoc){
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
			channelName:_channelName,
			mode:_mode
		}
		UserModel.create(entity, function(cerr, cdoc){
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
 * @type {get}
 * @param {seach:String} 关键词搜索
 * @param {mode:Number} 合作模式有CPA,CPS,参数分别是1,2,默认是1
 * @param {pageIndex:Number} 分页索引,1默认
 * @param {pageSize:Number} 分页长度,10默认
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
	if(!!_mode){
		if(_mode === '1'){
			filterObj.mode = 1;
		}else if(_mode === '2'){
			filterObj.mode = 2;
		}
	}

    //搜索
    if(!!_search){
    	filterObj.channelName = new RegExp(_search,'gim');
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

/**
 * @name  /api/admin/editChannel 编辑修改渠道
 * @type {post}
 * @param {realName:Sting} 真实姓名，默认空
 * @param {id:Sting} 渠道id不能为空
 * @param {mobile:String} 手机号码，默认空
 * @param {email:String} 邮箱，默认空
 * @param {gender:Number} 性别 1,2分别代码男女，默认是1
 * @param {company:String}  公司名称
 * @param {channelName:String} 渠道名称
 * @param {mode:Number}  合作模式，1，2分别代码CPA,CPS
 * @return {retCode:Number, msg:String, data:null}  
 */
var _editChannel = function(req, res){
	var _realName = req.body.realName,
		_channel_id = req.body.id,
		_mobile = req.body.mobile,
		_email = req.body.email,
		_gender = req.body.gender,
		_company = req.body.company,
		_channelName = req.body.channelName,
		_mode = req.body.mode;
	var editObj = {};

	if(!_channel_id || _channel_id.length !== 24){
		res.json({retCode:100031, msg:'渠道不存在', data:null});
		res.end();
		return;
	}

	//真实姓名
	if(!!_realName){
		if(_realName.length < 2){
			res.json({retCode:100025, msg:'真实姓名不为空时，不能少于2位', data:null});
			res.end();
			return;	
		}else{
			editObj.realName = _realName;
		}
	}
	
	//手机号码
	if(!!_mobile){
		if(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/g.test(_mobile)){
			editObj.mobile = _mobile;
		}else{
			res.json({retCode:100026, msg:'手机号码格式正确', data:null});
			res.end();
			return;
		}
	}
	//邮箱
	if(!!_email){
		if(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(_email)){
			editObj.email = _email;
		}else{
			res.json({retCode:100027, msg:'邮箱格式正确', data:null});
			res.end();
			return;
		}
	}
	//性别
	if(!_gender || (_gender !== '1' && _gender !== '2')){
		editObj.gender = 1;
	}else{
		editObj.gender = parseInt(_gender);
	}

	//company
	if(!!_company){
		if(_company.length < 2){
			res.json({retCode:100028, msg:'公司名称为空的时候，长度不能少于2位', data:null});
			res.end();
			return;
		}else{
			editObj.company = _company;
		}
	}
	//_channelName
	if(!!_channelName){
		if(_channelName.length < 2){
			res.json({retCode:100029, msg:'渠道长度不能少于2位', data:null});
			res.end();
			return;
		}else{
			editObj.channelName = _channelName;
		}
	}else{
		res.json({retCode:100031, msg:'渠道不存在', data:null});
		res.end();
		return;
	}
	//mode
	if(!!_mode){
		console.log(_mode)
		if(_mode !== '1' && _mode !=='2'){
			res.json({retCode:100030, msg:'合作模式不能为空', data:null});
			res.end();
			return;
		}else{
			editObj.mode = parseInt(_mode);
		}
	}else{
		res.json({retCode:100030, msg:'合作模式不能为空', data:null});
		res.end();
		return;
		
	}

	//判断id是否存在
	var _isExistChannel = function(){
		var defer = Q.defer();
		UserModel.findOne({_id:_channel_id}, function(ferr, fdoc){
			if(ferr){
				res.sendStatus(500);
				res.end();
				return;
			}
			if(!fdoc){
				res.json({retCode:100031, msg:'该渠道不存在', data:null});
				res.end();
				return;
			}
			defer.resolve();
		});
		return defer.promise;
	}

	//返回修改实体
	var _responseEntity = function(){
		editObj.lastUpdateTime = Date.now();
		UserModel.findByIdAndUpdate(_channel_id,{$set:editObj},function(fuerr, fudoc){
			if(fuerr || !fudoc){
				res.sendStatus(500);
				res.end();
				return;
			}
			res.json({retCode:0, msg:'修改成功', data:fudoc});
			res.end();
		});
	}
	_isExistChannel().then(_responseEntity);

}

/**
 * @name  /api/admin/getChannelDetail 获取指定id的渠道信息
 * @type {get}
 * @param {id:String} 渠道id
 * @return {retCode:Number, msg:String, data:entity }  
 */
var _getChannelDetail = function(req, res){
 	if(!req.query.id || req.query.id.length !== 24){
 		res.json({retCode:100032, msg:'无该渠道信息', data:null});
 		res.end();
 		return;
 	}
 	UserModel.findById(req.query.id, function(ferr, fdoc){
 		if(ferr){
 			res.sendStatus(500);
 			res.end();
 			return;
 		}
 		if(!fdoc){
 			res.json({retCode:100032, msg:'无该渠道信息', data:null});
	 		res.end();
	 		return;
 		}
 		res.json({retCode:0, msg:'查询成功', data:fdoc});
 		res.end();
 	});
}

/**
 * @name  /api/admin/editChannelPassword 修改渠道密码
 * @type {post}
 * @param {id:String}  渠道id
 * @param {password:String}  新密码
 */
var _editChannelPassword = function(req, res){
 	var _channel_id = req.body.id,
 		_password = req.body.password;
 	if(!_channel_id || _channel_id.length !== 24){
 		res.json({retCode:100032, msg:'无该渠道信息', data:null});
 		res.end();
 		return;
 	}
 	if(!_password || _password.length < 6){
 		res.json({retCode:100033, msg:'密码长度不能少于6', data:null});
 		res.end();
 		return;
 	}
 	
 	//判断id是否存在
	var _isExistChannel = function(){
		var defer = Q.defer();
		UserModel.findOne({_id:_channel_id}, function(ferr, fdoc){
			if(ferr){
				res.sendStatus(500);
				res.end();
				return;
			}
			if(!fdoc){
				res.json({retCode:100031, msg:'该渠道不存在', data:null});
				res.end();
				return;
			}
			defer.resolve();
		});
		return defer.promise;
	}
	//修改密码
	var _editAndResponse = function(){
		UserModel.findByIdAndUpdate(_channel_id,{$set:{password:_password}}, function(uerr, udoc){
			if(uerr){
				res.sendStatus(500);
				res.end();
				return;
			}
			res.json({retCode:0, msg:'修改成功', data:null});
			res.end();
		});
	}
	_isExistChannel().then(_editAndResponse);
}

/**
 * @name  /api/admin/delChannel 删除渠道
 * @param {id:ObjectId} id 渠道id
 */
var _delChannel = function(req, res){
	var _channel_id = req.query.channelId;
	if(!_channel_id || _channel_id.length !== 24){
		res.json({retCode:100032, msg:'无该渠道信息', data:null});
 		res.end();
 		return;
	}
	//是否存在渠道
	var _isExistChannel = function(){
		var defer = Q.defer();
		UserModel.findOne({_id:_channel_id}, function(ferr, fdoc){
			if(ferr){
				res.sendStatus(500);
				res.end();
				return;
			}
			if(!fdoc){
				res.json({retCode:100031, msg:'该渠道不存在', data:null});
				res.end();
				return;
			}
			defer.resolve(fdoc);
		});
		return defer.promise;
	}
	//删除改渠道下的所有游戏
	var _delAllGame = function(_channelObj){

		var _model = _channelObj.mode == 1 ? CostActiveModel : CostSalesModel;
		var defer = Q.defer();
		_model.remove({channel: _channelObj._id}, function(rerr, robj){
			if(rerr || !robj.result.ok){
				res.sendStatus(500);
				res.end();
				return;
			}
			defer.resolve();
		});
		return defer.promise;
	}
	//删除该渠道
	var _delTheChannel = function(_glist){
		UserModel.findByIdAndRemove(_channel_id, function(frerr, frdoc){
			if(frerr){
				res.sendStatus(500);
				res.end();
				return;
			}
			res.json({retCode:0, msg:'删除成功', data:frdoc});
			res.end();
		});
	}
	_isExistChannel().then(_delAllGame).then(_delTheChannel);
}

exports.addChannel = _addChannel;
exports.getChannelList = _getChannelList;
exports.editChannel = _editChannel;
exports.getChannelDetail = _getChannelDetail;
exports.editChannelPassword = _editChannelPassword;
exports.delChannel = _delChannel