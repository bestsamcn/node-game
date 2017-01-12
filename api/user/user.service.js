//服务器根目录路径
var $$ = require('../../tools');
var Q = require('q');
var UserModel = require('../../model/').UserModel;
var crypto = require('crypto');

/**
 * _userSignup 用户注册
 * @param  {object} req 
 * @param  {object} res 
 * @return {object}     {retCode:Number, data:Object, msg:String}
 */
var _userSignup = function(req, res){
	
	var _account = req.body.account;
	var _password = req.body.password;
	// var _code = req.body.code;
	var _mobile = req.body.mobile || '';
	var uip = $$.getClientIp(req).match(/\d+\.\d+\.\d+\.\d+/)[0];

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
	 * _isExitAccount 检测用户名重复
	 * @return {promise} 返回一个可以执行的promise
	 */
	var _isExitAccount = function(){
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
		UserModel.create({
			account: _account,
			password: _password,
			mobile: _mobile,
			createLog: {
				createTime: Date.now(),
				createIp: uip
			}
		},function(cerr, cdoc){
			if(cerr){
				res.sendStatus(500);
				res.end();
				return;
			}
			res.json({ retCode:0, msg:'注册成功', data:cdoc});
			res.end();
		});
	}
	_isExitAccount().then(_createAccount);

	
}


exports.userSignup = _userSignup;