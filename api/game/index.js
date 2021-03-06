var express = require('express');
var router = express.Router();
var onlyAllowAdmin = require('../../interceptor/user').onlyAllowAdmin;
var apiJustForAdminAndYourself  = require('../../interceptor/user').apiJustForAdminAndYourself;
var gameService = require('./game.service');

/**
 * 添加游戏
 */
router.post('/addCpaGame', onlyAllowAdmin, gameService.addCpaGame);
router.post('/addCpsGame', onlyAllowAdmin, gameService.addCpsGame);
router.get('/getGameList', apiJustForAdminAndYourself, gameService.getGameList);
router.get('/getGameDetail', apiJustForAdminAndYourself, gameService.getGameDetail);
router.post('/editCpaGame', onlyAllowAdmin, gameService.editCpaGame);
router.post('/editCpsGame', onlyAllowAdmin, gameService.editCpsGame);
router.get('/delGame', onlyAllowAdmin, gameService.delGame);

module.exports = router;