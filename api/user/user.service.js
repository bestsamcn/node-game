/**
 * 用户服务模块
 */

//服务器根目录路径
var $$ = require('../../tools');
var Q = require('q');
var UserModel = require('../../model/').UserModel;
var crypto = require('crypto');
var _ = require('loadash');

/**
 * _userSignup 用户注册
 * @param  {account} 用户帐号
 * @param  {password} 用户密码 
 * @return {object}     {retCode:Number, data:Object, msg:String}
 */
var _userSignup = function(req, res){
	var _account = req.body.account;
	var _password = req.body.password;
	// var _code = req.body.code;
	var _mobile = req.body.mobile || '';
	//localhost访问会无法获取ip
	var uip = $$.getClientIp(req).match(/\d+\.\d+\.\d+\.\d+/)[0] || '';

	//检测验证码
	// if (_code !== req.session.randomCode) {
	// 	res.json({
	// 		retCode: 100001,
	// 		msg: '验证码错误',
	// 		data: null
	// 	});
	// 	res.end();
	// 	return;
	// }
	_account = _.trim(_account);
	_password = _.trim(_password);
	//数据格式验证
	if (_account.length < 2 || _account.length > 24) {
		res.json({
			retCode: 100002,
			msg: '用户名格式错误',
			data: null
		});
		res.end(); return;
	}
	if (_password.length < 6 || _password.length > 24) {
		res.json({
			retCode: 100003,
			msg: '密码格式错误',
			data: null
		});
		res.end();
		return;
	}
    
	if (_mobile && _mobile !== '') {
		if (!/^1[3-9]{1}[0-9]{9}$/.test(_mobile)) {
			res.json({
				retCode: 100004,
				msg: '手机号码格式错误',
				data: null
			});
			res.end();
			return;
		}
	}


	var createTime = new Date().getTime();
	var md5 = crypto.createHash('md5');
	_password = md5.update(_password).digest('hex');

	
	/**
	 * _notExistAccount 检测用户名重复
	 * @return {promise} 返回一个可以执行的promise
	 */
	var _notExistAccount = function(){
		
		var defer = Q.defer();

		UserModel.findOne({ account:_account }, function(ferr, fdoc){
			if(ferr){
				res.senStatus(500);
				res.end();
				return;
			}
			if(fdoc){
				res.json({retCode:100001, msg:'用户名已经存在', data:null});
				res.end();
				return;
			}
			defer.resolve();
		});
		return defer.promise;
	}

	/**
	 * _createAccount 创建用户
	 * @return { Object } 
	 */
	var _createAccount = function(){
		var UserEntity = new UserModel({
			account: _account,
			password: _password,
			mobile: _mobile,
			createLog: {
				createTime: Date.now(),
				createIp: uip
			}
		});
		UserEntity.save(function(cerr, cdoc){
			if(cerr){
				res.sendStatus(500);
				res.end();
				return;
			}
			res.json({ retCode:0, msg:'注册成功', data:cdoc});
			res.end();
		});
	}
	_notExistAccount().then(_createAccount);
}

/**
 * 用户登录
 * @param  {account}  用户账号
 * @param  {password} 用户密码
 * @return {object}   返回提示码，提示信息，用户信息
 */
var _userSignin = function(req, res){
	var _account = req.body.account,
		_password = req.body.password;
	_account = _.trim(_account);
	_password = _.trim(_password);
	if(!_account || _account.length < 2){
		res.json({retCode: 100005, msg:'用户名不能为空或者少于2位', data:null});
		res.end();
		return;
	}
	if(!_password || _password.length < 6){
		res.json({retCode: 100006, msg:'密码不能为空或者少于6位'});
		res.end();
		return;
	}

	/**
	* 检测用户名是否存在
	* @return {object} promise
	*/
	var _isExistAccount = function(){
		var defer = Q.defer();
		UserModel.findOne({ account:_account }, function(ferr, fdoc){
			if(ferr){
				res.sendStatus(500);
				res.end();
				return;
			}
			if(!fdoc){
				res.json({ retCode:100007, msg:'用户名不存在', data:null });
				res.end();
				return;
			}
			defer.resolve(fdoc);
		});
		return defer.promise;
	}

	/**
	 * 匹配用户密码
	 */
	var _isEqualToPassword = function(fdoc){
		var defer = Q.defer();
		var md5 = crypto.createHash('md5');
		_password = md5.update(_password).digest('hex');
		if(_password !== fdoc.password ){
			res.json({ retCode:100008, msg:'密码错误', data:null });
			res.end();
			return;
		}
		defer.resolve(fdoc);
		return defer.promise;
	}

	/**
	 * 更新用户最后登录时间
	 */
	var _updateLastLoginTime = function(fdoc){
		UserModel.findByIdAndUpdate(fdoc._id, {$set: {lastLoginTime: Date.now()}}, function(fuerr, fudoc){
			if(fuerr){
				res.sendStatus(500);
				res.end();
				return;
			}
			//redis保存登录信息
			req.session.user = fudoc;
			req.session.isLogin = true;
			res.locals.session = req.session;
			res.json({ retCode:0, msg:'登录成功', data:fudoc });
			res.end();
		});
	}
	_isExistAccount().then(_isEqualToPassword).then(_updateLastLoginTime); 
}

/**
 *  返回去当前用户
 */
var _getCurrentUser = function(req, res){
	res.setHeader('content-type', 'text/javascript');
	if (!req.session.isLogin) {
		res.send('window.userInfo = null');
		res.end();
		return;
	}
	_userInfo = {};
	_userInfo.id = req.session.user._id.toString();
	_userInfo.account = req.session.user.account;
	_userInfo.userType = req.session.user.userType;
	_userInfo.gender = req.session.user.gender;
	_userInfo.email = req.session.user.email;
	_userInfo.realName = req.session.user.realName;
	_userInfo.mobile = req.session.user.mobile;
	var str = 'window.userInfo = ' + JSON.stringify(_userInfo);
	res.send(str);
	res.end();
}

/**
 * 退出登录
 */
var _userSignout =  function(req, res) {
	if(!req.session.isLogin){
		res.json({retCode:100010, msg:'查找无登录信息', data:null });
		res.end();
		return;
	}
	req.session.user = null;
	req.session.isLogin = false;
	res.locals.session = req.session;
	res.clearCookie('NODESESSIONID');
	// res.json({retCode:0,msg:'退出成功',data:null});
	res.redirect('/sign/signin');
};

exports.userSignup = _userSignup;
exports.userSignin = _userSignin;
exports.userSignout = _userSignout;
exports.getCurrentUser = _getCurrentUser;