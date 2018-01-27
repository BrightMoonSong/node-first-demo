// MySQL数据库联接配置
module.exports = {
	mysql: {
		host: '127.0.0.1',
		user: 'root',
		password: 'root',
		database: 'book', // 前面建的user表位于这个数据库中
		port: 3306
	}
};
//http://cnodejs.org/topic/516b77e86d382773064266df
//MySQL中有一个名叫wait_timeout的变量，表示操作超时时间，当连接超过一定时间没有活动后，会自动关闭该连接，这个值默认为28800（即8小时）。
//function handleError(err) {
//	if(err) {
//		// 如果是连接断开，自动重新连接
//		if(err.code === 'PROTOCOL_CONNECTION_LOST') {
//			connect();
//		} else {
//			console.error(err.stack || err);
//		}
//	}
//}
//
//// 连接数据库
//function connect() {
//	db = mysql.createConnection(config);
//	db.connect(handleError);
//	db.on('error', handleError);
//}
//
//var db;
//connect();