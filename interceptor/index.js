/**
 * 拦截模块
 */

var getMe = require('./user/index').getMe;
var _globalConfig = require('../config');
var _userIneterceptor = function(app){
	app.locals.globalConfig = _globalConfig;
	app.use(getMe);
}
module.exports = _userIneterceptor;