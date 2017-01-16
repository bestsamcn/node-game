var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

var globalConfig = require('./config');
var ROOT_DIR = process.cwd();
var session = require('express-session');
var app = express();
var RedisStore = require('connect-redis')(session);

// view engine setup
var template = require('art-template');
template.config('base', '');
template.config('cache', globalConfig.templateCache);
template.config('extname', '.html');
app.engine('.html', template.__express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use('/public', express.static(__dirname + '/public'));


//redis
var config = require('./config').redisConfig;
app.use(session({
    name: config.name,
    store: new RedisStore(config.sessionStore),
    resave: false,
    proxy: true,
    saveUninitialized: true,
    cookie: config.cookie,
    secret: config.secret
}));

//更新个人信息
require('./interceptor')(app);

//路由
require('./routes')(app);

//接口
require('./api')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        var code = err.status || 500;
        res.render(code.toString(), {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('404', {
        message: err.message,
        error: {}
    });
});


module.exports = app;