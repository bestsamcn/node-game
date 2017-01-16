
/**
 * 接口组
 */

var _user = require('./user');
var _message = require('./message');
var _apiGroup = function(app){
	app.use('/api/user', _user);
	app.use('/api/message', _message);
}
module.exports = _apiGroup;