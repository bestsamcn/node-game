/**
 * sign.controller
 * 登录路由控制器管理模块
 */
var express = require('express');
var router = express.Router();

/**
 * 登录之后，禁止进入登录注册页面
 */
// router.get('*',function(req, res, next){
// 	if(req.session.isLogin){
// 		res.redirect('/');
// 		return;
// 	}
// 	next();
// });

/**
 * @router signin 登录
 */
router.get('/signin',function(req, res){
	res.render('tpl/sign/signin',{
		routerName:'sign/signin',
		title:'登录'
	});
});

/**
 * @router signin 注册
 */
// router.get('/signup',function(req, res){
// 	res.render('tpl/sign/signup',{
// 		routerName:'sign/signup',
// 		title:'注册'
// 	});
// });

module.exports = router;