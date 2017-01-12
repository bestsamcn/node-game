var express = require('express');
var router = express.Router();
var service = require('./user.service');

//用户登录
router.post('/signup',service.userSignup);

module.exports = router;