/**
 * routes/index.js
 * 路由集中管理模块
 */

var indexController = require('./index.controller');
var homeController = require('./home.controller');
var signController = require('./sign.controller');
var userController = require('./user.controller');
var router =  function(app){
	app.use('/',indexController);
	app.use('/home',homeController);
	app.use('/sign',signController);
	app.use('/user',userController);
}
exports = module.exports = router;