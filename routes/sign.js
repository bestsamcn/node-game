var express = require('express');
var router = express.Router();

/**
 * 登录路由
 */
router.get('/signin',function(req, res){
	res.render('tpl/sign/signup',{
		routerName:'sign/signup',
		title:'登录'
	});
});

module.exports = router;