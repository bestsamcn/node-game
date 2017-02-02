var express = require('express');
var router = express.Router();
var onlyAllowAdmin = require('../../interceptor/user').onlyAllowAdmin;
var apiJustForAdminAndYourself = require('../../interceptor/user').apiJustForAdminAndYourself;

var adminService = require('./admin.service');
router.post('/addChannel', onlyAllowAdmin, adminService.addChannel);
router.get('/getChannelList', onlyAllowAdmin, adminService.getChannelList);
router.post('/editChannel', onlyAllowAdmin, adminService.editChannel);
router.get('/getChannelDetail', apiJustForAdminAndYourself, adminService.getChannelDetail);
router.post('/editChannelPassword', onlyAllowAdmin, adminService.editChannelPassword);
router.get('/delChannel', onlyAllowAdmin, adminService.delChannel);


module.exports = router;