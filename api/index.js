
/**
 * 接口组
 */

var user = require('./user');
var message = require('./message');
var admin = require('./admin');
var game = require('./game');
var _apiGroup = function(app){
	app.use('/api/user', user);
	app.use('/api/message', message);
	app.use('/api/admin', admin);
	app.use('/api/game', game);
}
module.exports = _apiGroup;