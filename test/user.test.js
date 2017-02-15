var app = require('../bin/www');
var R = require('supertest')(app);
var UserModel = require('../model').UserModel;
var expect = require('chai').expect;
var md5 = require('crypto').createHash('md5');


/**
 * 注册接口,添加md5加密
 */
describe('user.test.js', function(){
	var _account, _password, _mobile, _id; 
	/**
	 * 注册
	 */
	describe('POST /api/user/signup', function(){
		//1.都为空
		it('should return error when nothing input', function(done){
			R.post('/api/user/signup')
			.set('accept', 'application/json')
			.send({
				account:'',
				password:''
			})
			.expect(422, done());
		});
		//2.用户名为空
		it('should return error when account is empty', function(done){
			R.post('/api/user/signup')
			.set('accept', 'application/json')
			.send({
				account:'',
				password:'123123'
			})
			.expect(422, done());
		});
		//3.密码为空
		it('should return error when password is empty', function(done){
			R.post('/api/user/signup')
			.set('accept', 'application/json')
			.send({
				account:'test',
				password:''
			})
			.expect(422, done());
		});
		//4.用户名长度少于两位
		it('should return error when the length of account is less then 2', function(done){
			R.post('/api/user/signup')
			.set('accept', 'application/json')
			.send({
				account:'a',
				password:'123123'
			})
			.expect(422, done());
		});
		//5.密码长度少于6
		it('should return error when the length of account is less then 2', function(done){
			R.post('/api/user/signup')
			.set('accept', 'application/json')
			.send({
				account:'a',
				password:'12312'
			})
			.expect(422, done());
		});
		//6.用户名重复或创建新用户
		it('should return error when the account is already exist or create new user when everything is good', function(done){
			R.post('/api/user/signup')
			.set('accept', 'application/json')
			.send({
				account:'test',
				password:'123123'
			})
			.expect(200)
			.end(function(err, res){
				if(err) return done(err);
				if(res.body.retCode === 100001 && res.body.msg === '用户名已经存在') return done();
				if(res.body.retCode !== 0 ) return done();
				expect(res.body.retCode).to.be.equal(0);
				expect(res.body.data).to.be.an('object');
				_account = res.body.data.account;
				_password = res.body.data.password;
				_id = res.body.data._id;
				done();
			});
		});
	});
	/**
	 * 登录
	 */
	describe('POST /api/user/signin', function(){
		//1.无输入
		it('should return error when nothing is input', function(done){
			R.post('/api/user/signin')
			.set('accept', 'application/json')
			.send({
				account:'',
				password:''
			})
			.expect(422, done());
		});
		//2.账号无输入
		it('should return error when account is empty', function(done){
			R.post('/api/user/signin')
			.set('accept', 'application/json')
			.send({
				account:'',
				password:_password
			})
			.expect(422, done());
		});
		//3.账号无输入
		it('should return error when password is empty', function(done){
			R.post('/api/user/signin')
			.set('accept', 'application/json')
			.send({
				account:_account,
				password:''
			})
			.expect(422, done());
		});
		//4.用户名少于两位
		it('should return error when the length of account less then 2', function(done){
			R.post('/api/user/signin')
			.set('accept', 'application/json')
			.send({
				account:'t',
				password:'123123'
			})
			.expect(422, done());
		});
		//5.密码少于6位
		it('should return error when the length of password less then 6', function(done){
			R.post('/api/user/signin')
			.set('accept', 'application/json')
			.send({
				account:'t',
				password:'12123'
			})
			.expect(422, done());
		});
		//6.用户不存在
		it('should return error when the account is not exist', function(done){
			R.post('/api/user/signin')
			.set('accept', 'application/json')
			.send({
				account:'tttt',
				password:_password
			})
			.expect(200)
			.end(function(err, res){
				if(err) return done(err);
				expect(res.body.retCode).to.be.equal(100007);
				done();
			});
		});
		//7.密码错误
		it('should return error when the password is not equal to account', function(done){
			R.post('/api/user/signin')
			.set('accept', 'application/json')
			.send({
				account:_account,
				password:'1232123'
			})
			.expect(200)
			.end(function(err, res){
				if(err) return done(err);
				expect(res.body.retCode).to.be.equal(100008);
				done();
			});
		});
		//8.登录成功
		it('should return sucess when everything is ok', function(done){
			R.post('/api/user/signin')
			.set('accept', 'application/json')
			.send({
				account:_account,
				password:_password
			})
			.expect(200)
			.end(function(err, res){
				if(err) return done(err);
				expect(res.body.retCode).to.be.equal(0);
				done();
			});
		});
	});

	/**
	 * 退出登录
	 */
	describe('GET /api/user/signout', function(){
		it('should return success', function(){
			R.get('/api/user/signout')
			.expect(200)
			.end(function(err, res){
				expect(302,done());
			});
		});
	});

	/**
	 * 删除用户
	 */
	describe('GET /api/user/delUser', function(){
		console.log(_account, 'ffffffffffffff')
		it('should return error when the account is empty', function(done){
			R.get('/api/user/delUser')
			.set('accept', 'application/json')
			.query({
				account:''
			})
			.expect(422, done())
		});
		it('should return error when the account is not exist', function(done){
			R.get('/api/user/delUser')
			.set('accept', 'application/json')
			.query({
				account:'tttt'
			})
			.expect(200)
			.end(function(err, res){
				if(err) return done(err);
				expect(res.body.retCode).to.be.equal(100007);
				done();
			});
		});
		it('should return success when everything is ok', function(done){
			R.get('/api/user/delUser')
			.set('accept', 'application/json')
			.query({
				account:_account
			})
			.expect(200)
			.end(function(err, res){
				if(err) return done(err);
				expect(res.body.retCode).to.be.equal(0);
				done();
			});

		});
	});
});