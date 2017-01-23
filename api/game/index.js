var express = require('express');
var router = express.Router();
var onlyAllowAdmin = require('../../interceptor/user');

var gameService = require('./game.service');

/**
 * 添加游戏
 */
router.post('/addGame', onlyAllowAdmin, gameService.addGame);

module.exports = router;