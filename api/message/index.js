var express = require('express');
var router = express.Router();
var messageService = require('./message.service');
var onlyAllowAdmin = require('../../interceptor/user').onlyAllowAdmin;

//新增留言
router.post('/addMessage',messageService.addMessage);
router.get('/getMessageList', onlyAllowAdmin, messageService.getMessageList);
router.get('/delMessage', onlyAllowAdmin, messageService.delMessage);
router.get('/getAdjoinMessage', onlyAllowAdmin, messageService.getAdjoinMessage);
router.get('/getMessageDetail', onlyAllowAdmin, messageService.getMessageDetail);
router.get('/getMessageDetail', onlyAllowAdmin, messageService.getMessageDetail);
router.get('/getUnreadMessageList', onlyAllowAdmin, messageService.getUnreadMessageList);


module.exports = router;