var NODE_HOST = process.env.NODE_ENV || 'localhost',
	NODE_PORT = process.env.NODE_PORT || 3030,
	NODE_DATABASE = 'game',
	NODE_SECRECT = 'node-game',
	NODE_COOKIEID = 'NODESESSIONID',
	NODE_REDIS_PORT = process.env.NODE_REDIS_PORT || 6379;
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
		mongodb: 'mongodb://'+NODE_HOST+'/'+NODE_DATABASE,
		// mongodb: 'mongodb://10.28.5.197/swyc',
	    database: NODE_DATABASE,
	    server: NODE_HOST
	},
	authSecret:'080994c0cce4b706',
	imageSecret:'game'
}
exports = module.exports = _config;
