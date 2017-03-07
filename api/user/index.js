/**
 * 用户接口集中输出
 */
var express = require('express');
var router = express.Router();
var service = require('./user.service');
var onlyAllowAdmin = require('../../interceptor/user').onlyAllowAdmin;


router.post('/signup',service.userSignup);
router.post('/signin',service.userSignin);
router.get('/signout',service.userSignout);
router.get('/delUser', onlyAllowAdmin, service.delUser);


module.exports = router;