var express = require('express');
var router = express.Router();
var R = require('requestify');
var Q = require('q');
var globalConfig = require('../config');

router.get('*', function(req, res, next) {
    if (!req.session.isLogin) {
        res.redirect('/sign/signin');
        res.end();
        return;
    }
    next();
});

/**
 * 留言
 */
router.get('/', function(req, res, next) {
    res.render('tpl/message/index', {
        routerName: '/message',
        title: '留言板'
    });
});

/**
 * 详情
 */
router.get('/messageDetail/:id', function(req, res) {
    var msg_id = req.params.id;
    var rcookie = req.cookies.NODESESSIONID;
    if(!msg_id || msg_id.length !== 24){
        res.redirect('back');
        res.end();
        return;
    }
    //获取当前id数据
    var _getCurrentMessage = function(){
        var defer = Q.defer();
        R.request('http://'+globalConfig.host+':'+globalConfig.port+'/api/message/getMessageDetail',{
            method:'get',
            params:{
                id:msg_id
            },
            dataType:'json',
            cookies:{
                NODESESSIONID:rcookie
            }
        }).then(function(data){
            var _messageDetail = JSON.parse(data.body).data;
            defer.resolve(_messageDetail);
        },function(data){
            res.redirect('back');
            res.end();
        });
        return defer.promise;
    }
    //获取相邻id数据
    var _getAdjoinMessage = function(){
        var defer = Q.defer();
        R.request('http://'+globalConfig.host+':'+globalConfig.port+'/api/message/getAdjoinMessage',{
            method:'get',
            params:{
                id:msg_id
            },
            dataType:'json',
            cookies:{
                NODESESSIONID:rcookie
            }
        }).then(function(data){
            var _adJoinMessageList = JSON.parse(data.body).data;
            defer.resolve(_adJoinMessageList);
        },function(data){
            res.redirect('back');
            res.end();
        });
        return defer.promise;
    }
    var _responseMessageList = function(){
        Q.all([_getCurrentMessage(), _getAdjoinMessage()]).then(function(mList){
            console.log(mList)
            res.render('tpl/message/messageDetail', {
                routerName: '/message/messageDetail',
                title: '留言详情',
                messageDetail:mList
            });
        });
    }
    _responseMessageList();
    
});

module.exports = router;
