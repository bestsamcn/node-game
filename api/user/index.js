/**
 * 用户接口集中输出
 */
var express = require('express');
var router = express.Router();
var service = require('./user.service');


router.post('/signup',service.userSignup);
router.post('/signin',service.userSignin);
router.get('/signout',service.userSignout);
router.get('/delUser',service.delUser);

module.exports = router;