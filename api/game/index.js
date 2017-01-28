var express = require('express');
var router = express.Router();
var onlyAllowAdmin = require('../../interceptor/user').onlyAllowAdmin;

var gameService = require('./game.service');

/**
 * 添加游戏
 */
router.post('/addCpaGame', onlyAllowAdmin, gameService.addCpaGame);
router.post('/addCpsGame', onlyAllowAdmin, gameService.addCpsGame);
router.get('/getGameList', onlyAllowAdmin, gameService.getGameList);

module.exports = router;