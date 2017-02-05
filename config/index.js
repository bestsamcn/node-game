var NODE_ENV = process.env.NODE_ENV || 'development',
	NODE_HOST = process.env.NODE_HOST || '127.0.0.1',
	NODE_PORT = process.env.NODE_PORT || 3030,
	NODE_SECRECT = process.env.NODE_SECRECT || 'node-game',
	NODE_COOKIEID = 'NODESESSIONID',
	NODE_REDIS_PORT = process.env.NODE_REDIS_PORT || 6379,
	TEMPLATE_CACHE = ( NODE_ENV !== 'development' ),
	MONGO_DATABASE = process.env.MONGO_DATABASE || 'game',
	MONGO_USER = process.env.MONGO_USER || 'game',
	MONGO_PASSWORD = process.env.MONGO_PASSWORD || '123123';
	MONGO_PORT = process.env.MONGO_PORT || 27017;
var _config = {
	host:NODE_HOST,
	port:NODE_PORT,
	redisConfig:{
		name: NODE_COOKIEID,
	    secret: NODE_SECRECT,
	    cookie: {
	        maxAge: 1000 * 60 * 60 * 24,
	        httpOnly:true
	    },
	    sessionStore: {
	        host: NODE_HOST,
	        port: NODE_REDIS_PORT,
	        db: 2,
	        ttl: 60 * 60 * 24,
	        logErrors: true
	    }
	},
	mongoConfig:{
		// mongoose.connect('mongodb://username:password@host:port/database?options...');
		// mongodb: 'mongodb://admin:123123@10.28.5.197/swyc',
		mongodb: 'mongodb://'+MONGO_USER+':'+MONGO_PASSWORD+'@'+NODE_HOST+':'+MONGO_PORT+'/'+MONGO_DATABASE,
	    database: MONGO_DATABASE,
	    server: NODE_HOST
	},
	authSecret:'080994c0cce4b706',
	imageSecret:'game',
	templateCache:TEMPLATE_CACHE
}
exports = module.exports = _config;
