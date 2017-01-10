//模块目录结构最佳实践
var _user = require('./user');
var _userApi = function(app){
	app.use('/user',_user);
}