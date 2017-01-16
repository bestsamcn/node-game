var express = require('express');
var router = express.Router();


router.get('*', function(req, res, next){
	if(!req.session.isLogin){
		res.redirect('/sign/signin');
		res.end();
		return;
	}
	next();
});

/**
 * 留言
 */
router.get('/', function(req, res, next) {
	res.render('tpl/message/index', {
		routerName: '/message',
		title:'留言板'
	});
});

/**
 * 详情
 */
 router.get('/messageDetailt/:id', function(req, res){
 	if(!req.params.id || req.params.id.length !== 24){
 		res.sendStatus(404);
 		res.end();
 		return;
 	}
 });



module.exports = router;