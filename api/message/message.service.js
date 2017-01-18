/**
 * 留言服务模块
 */
var Q = require('q');
var MessageModel = require('../../model').MessageModel;
var UserModel = require('../../model').UserModel;
var xss = require('xss');


/**
 * @/api/message/addMessage 用户访客留言接口
 * @name  {String, require} 用户名称必填
 * @email {String, require} 用户的邮箱
 * @content {String, require} 留言内容
 * @return { Object } 返回
 */

var _addMessage = function(req, res) {

	var _name = req.body.name,
		_email = req.body.email,
		_content = req.body.content;
	if (!_name || _name.length < 2) {
		res.json({
			retCode: 100011,
			msg: '昵称长度不能少于两位',
			data: null
		});
		res.end();
		return;
	}
	if (!_email || !/^\w+@\w+\.\w+$/g.test(_email)) {
		res.json({
			retCode: 100012,
			msg: '邮箱格式不正确',
			data: null
		});
		res.end();
		return;
	}
	if (!_content || _content.length < 6) {
		res.json({
			retCode: 100013,
			msg: '内容长度不能少于6位',
			data: null
		});
		res.end();
		return;
	}

	var _xssContent = xss(_content);

	var _member = req.session.isLogin ? req.session.user._id : null;
	var MessageEntity = new MessageModel({
		name: _name,
		email: _email,
		content: _xssContent,
		member: _member,
		postTime: Date.now()
	});
	MessageEntity.save(function(cerr, cdoc) {
		if (cerr) {
			res.sendStatus(500);
			res.end();
			return;
		}
		res.json({
			retCode: 0,
			msg: '留言成功',
			data: null
		});
		res.end();
	});
}

/**
 * @/api/message/getMessageList 获取留言列表分页
 * @pageIndex {Number, require} 分页索引
 * @pageSize {Number, require} 分页体积
 * @return { retCode, msg, data, total, pageIndex, pageSize } 返回 
 */
var _getMessageList = function(req, res) {
	var _pageIndex = parseInt(req.query.pageIndex) - 1 || 0,
		_pageSize = parseInt(req.query.pageSize) || 10;

	//获取分页数据
	var _getList = function() {
			var defer = Q.defer();
			MessageModel.find().sort({
				postTime: -1
			}).skip(_pageIndex * _pageSize).limit(_pageSize).populate('member').exec(function(ferr, flist) {
				if (ferr) {
					res.sendStatus(500);
					res.end();
					return;
				}
				var obj = {
					pageIndex: _pageIndex,
					pageSize: _pageSize,
					flist: flist
				}
				defer.resolve(obj);
			});
			return defer.promise;
		}
		//计算记录总数
	var _getTotal = function(obj) {
		MessageModel.count(function(cerr, ctotal) {
			if (cerr) {
				res.sendStatus(500);
				res.end();
				return;
			}
			res.json({
				retCode: 0,
				msg: '查询成功',
				data: obj.flist,
				pageIndex: obj.pageIndex + 1,
				pageSize: obj.pageSize,
				total: ctotal
			});
			res.end();
		});
	}
	_getList().then(_getTotal);
}

/**
 * @/api/message/delMessageList
 * @id {String} 留言id
 * @return {obj} 删除实体 
 */
var _delMessage = function(req, res) {
	var msg_id = req.query.id;
	if (!msg_id || msg_id.length !== 24) {
		res.json({
			retCode: 100014,
			msg: '查找该记录',
			data: null
		});
		res.end();
		return;
	}
	MessageModel.findByIdAndRemove(msg_id, function(rerr, rdoc) {
		if (rerr) {
			res.sendStatus(500);
			res.end();
			return;
		}

		res.json({
			retCode: 0,
			msg: '删除成功',
			data: rdoc
		});
		res.end();
	});
}

/**
 * 获取当前记录的相邻记录
 * @param  {direction} 方向可以是next,prev 
 * @param  {id} 当前记录的id 
 * @return {object} 返回相邻记录 
 */
var _getPrevAndNextMessage = function(req, res){
	var direction = req.query.direction,
		msg_id = req.query.id;
	if(!direction || direction.length !== 4){
		res.json({retCode:100015, msg:'请输入方向', data:null});
		res.end();
		return;
	}
	if(!msg_id || msg_id.length !== 24){
		res.json({retCode:100016, msg:'无该留言记录存在', data:null});
		res.end();
		return;
	}

	//首先查询当前id的记录是否存在
	var _isExistRecord = function(){
		var defer = Q.defer();
		MessageModel.findById(msg_id, function(ferr, fdoc){

			if(ferr){
				res.sendStatus(500);
				res.end();
				return;
			}

			defer.resolve();
		});
		return defer.promise;
	}

	//根据direction来确定排序寻找相邻的记录
	var _findRecord = function(){
		if(direction === 'prev'){
			MessageModel.find('_id',{$lt:ObjectId(msg_id)}).limit(1).sort({_id:1}).exec(function(ferr, fdoc){
				if(ferr){
					res.sendStatus(500);
					res.end();
					return;
				}
				res.json({retCode:0, msg:'查询成功', data:fdoc});
				res.end();
			});
		}else{
			MessageModel.find('_id',{$gt:ObjectId(msg_id)}).limit(1).sort({_id:1}).exec(function(ferr, fdoc){
				console.log(ferr, fdoc,'asdfasdf')
				if(ferr){
					res.sendStatus(500);
					res.end();
					return;
				}
				res.json({retCode:0, msg:'查询成功', data:fdoc});
				res.end();
			});
		}
	}
	_isExistRecord().then(_findRecord);
}


exports.addMessage = _addMessage;
exports.getMessageList = _getMessageList;
exports.delMessage = _delMessage;
exports.getPrevAndNextMessage = _getPrevAndNextMessage;