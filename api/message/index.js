var express = require('express');
var router = express.Router();
var messageService = require('./message.service');

//新增留言
router.post('/addMessage',messageService.addMessage);
router.get('/getMessageList',messageService.getMessageList);
router.get('/delMessage', messageService.delMessage);
router.get('/getAdjoinMessage', messageService.getAdjoinMessage);
router.get('/getMessageDetail', messageService.getMessageDetail);


module.exports = router;