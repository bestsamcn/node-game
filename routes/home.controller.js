/**
 * home.controller
 * 首页路由控制器管理模块
 */
var express = require('express');
var router = express.Router();

/**
 * 如果没有登录不能进入
 */
router.get('*', function(req, res, next){
	if(!req.session.isLogin){
		res.redirect('/sign/signin')
		res.end();
		return;
	}
	next();
})

router.get('/', function(req, res, next) {
	res.render('tpl/home/index', {
		routerName: '/home',
		title:'主页'
	});
});

module.exports = router;