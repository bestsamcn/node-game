/**
 * routes/index.js
 * 路由集中管理模块
 */

var homeController = require('./home.controller');
var signController = require('./sign.controller');
var userController = require('./user.controller');
var router =  function(app){
	app.use('/',homeController);
	app.use('/sign',signController);
	app.use('/user',userController);
}
exports = module.exports = router;