
/**
 * 接口组
 */

var user = require('./user');
var message = require('./message');
var admin = require('./admin');
var _apiGroup = function(app){
	app.use('/api/user', user);
	app.use('/api/message', message);
	app.use('/api/admin', admin);
}
module.exports = _apiGroup;