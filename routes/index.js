/**
 * routes/index.js
 * 路由集中管理模块
 */

var indexController = require('./index.controller');
var homeController = require('./home.controller');
var messageController = require('./message.controller');
var signController = require('./sign.controller');
var userController = require('./user.controller');
var adminController = require('./admin.controller');
var gameController = require('./game.controller');
var router =  function(app){
	app.use('/',indexController);
	app.use('/home',homeController);
	app.use('/message',messageController);
	app.use('/sign',signController);
	app.use('/user',userController);
	app.use('/admin',adminController);
	app.use('/game',gameController);
}
exports = module.exports = router;