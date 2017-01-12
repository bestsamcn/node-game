
/**
 * 接口组
 */

var _user = require('./user');
var _apiGroup = function(app){
	app.use('/api/user',_user);
}
module.exports = _apiGroup;