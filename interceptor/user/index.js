/**
 * 用户拦截器
 */
var UserModel = require('../../model').UserModel;
var AccessLogModel = require('../../model').AccessLogModel;
var $$ = require('../../tools');
/**
 * 获取当前用户
 */
var _getMe = function(req, res, next) {
    if (req.session.isLogin) {
        var use_id = req.session.user._id;
        UserModel.findOne({ _id: use_id}, function(ferr, fdoc) {
        	if(ferr){
        		return next(500);
        	}

            if (!!typeof fdoc) {
                req.session.user = fdoc;
                req.session.save();
                res.locals.session = req.session;
            }
            next()
        });
    } else {
        //如果用户没登录，需要预留session作为判断，否则res.locals.session = undefined
        res.locals.session = req.session;
        next()
    }
}
/**
 * 用户访问日志
 */
var _setAccessLog = function(req,res,next){
    var _url = req.path;
    if(!req.session.isLogin || req.session.user.userType !==1 || _url.indexOf('.') !== -1 || /^\/api/.test(_url)){
        return next();
    }
    var _ip = $$.getClientIp(req).match(/\d+\.\d+\.\d+\.\d+/)[0];
    var LogEntity = new AccessLogModel({
        member:req.session.user._id,
        accessIp:_ip,
        accessUrl:_url,
        accessTime:Date.now()
    });
    LogEntity.save(function(err,doc){
        if(err){
            return next(err);
        }
        next();
    });
}
/**
 * 用户权限控制
 */
var _onlyAllowAdmin = function(req, res, next){
    if(!req.session.isLogin || req.session.user.userType < 2){
        res.json({retCode:401, msg:'你没有权限', data:null});
        res.end();
        return;
    }
    next();
}
exports.getMe = _getMe;
exports.setAccessLog =_setAccessLog;
exports.onlyAllowAdmin = _onlyAllowAdmin;