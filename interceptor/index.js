/**
 * 拦截模块
 */

var _userIneterceptor = require('./user/index');
var _globalConfig = require('../config');
var setInterceptor = function(app){
	app.locals.globalConfig = _globalConfig;
	app.use(_userIneterceptor.getMe);
	app.use(_userIneterceptor.setAccessLog);
}
module.exports = setInterceptor;