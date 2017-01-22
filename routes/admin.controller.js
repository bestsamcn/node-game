/**
 * 管理中心路由
 */
var express = require('express');
var router = express.Router();
var globalConfig = require('../config');

//权限控制
router.get('*',function(req, res, next){
	if(!req.session.isLogin || req.session.user.userType < 2){
		res.redirect('back');
		res.end();
		return;
	}
	next();
});

/**
 * 首页
 */
router.get('/', function(req, res, next){
	res.render('tpl/admin/index',{
		routerName:'/admin',
		title:'管理后台'
	});
});

/**
 * 添加渠道
 */
router.get('/addChannel', function(req, res, next){
	res.render('tpl/admin/addChannel',{
		routerName:'/admin/addChannel',
		title:'添加渠道'
	});
});

	
module.exports = router;