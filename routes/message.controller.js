var express = require('express');
var router = express.Router();


router.get('*', function(req, res, next) {
    if (!req.session.isLogin) {
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
        title: '留言板'
    });
});

/**
 * 详情
 */
router.get('/messageDetail', function(req, res) {
    res.render('tpl/message/messageDetail', {
        routerName: '/message/messageDetail',
        title: '留言详情'
    });
});

module.exports = router;
