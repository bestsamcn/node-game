/**
 * home.controller
 * 首页路由控制器管理模块
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		routerName: '/',
		title:'首页'
	});
});

module.exports = router;