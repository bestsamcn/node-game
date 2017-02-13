/**
 * home.controller
 * 首页路由控制器管理模块
 */
var express = require('express');
var router = express.Router();

//首页
router.get('/', function(req, res, next) {
	res.redirect('/home');
	// res.render('index', {
	// 	routerName: '/',
	// 	title:'首页'
	// });
});

module.exports = router;