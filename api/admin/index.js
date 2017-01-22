var express = require('express');
var router = express.Router();
var onlyAllowAdmin = require('../../interceptor/user').onlyAllowAdmin;

var adminService = require('./admin.service');
router.post('/addChannel', onlyAllowAdmin, adminService.addChannel);
router.get('/getChannelList', onlyAllowAdmin, adminService.getChannelList);


module.exports = router;