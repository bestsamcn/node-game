/**
 * 用户拦截器
 */
var UserModel = require('../../model').UserModel;

/**
 * 获取当前用户
 */
var _getMe = function(req, res, next) {
    if (req.session.isLogin) {
        var _account = req.session.user.account;
        UserModel.findOne({ account: _account}, function(ferr, fdoc) {
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
exports.getMe = _getMe;