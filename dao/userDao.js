// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./userSqlMapping');
var getUtf8 = require('./getUtf8');
var getUtfTitle = require('./getUtfTitle');
var request = require('request');
var http = require('http');

// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, $conf.mysql));

// 向前台返回JSON方法的简单封装
var jsonWrite = function(res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code: '1',
			msg: '操作失败'
		});
	} else {
		res.json(ret);
	}
};

module.exports = {
	getimg: function(req, res, next) { //test
		var param = req.query || req.params;
		console.log('param.url');
		console.log(param.url);
		var fs = require("fs");

		var imageBuf = fs.readFileSync(param.url);
		var ss = imageBuf.toString("base64")
		console.log('ss');
		console.log(ss);
		
//		http.get(param.url, function(res) {　　
//			var chunks = [];
//			console.log('urlurl');
//			var size = 0;
//			res.on('data', function(chunk) {　　　　
//				chunks.push(chunk);
//				size += chunk.length;
//			});　
//			　　
//			res.on('end', function(err) {				　　　　
//				var data = Buffer.concat(chunks, size);　
//				var base64Img = data.toString('base64');
//				console.log(base64Img);
//				jsonWrite(res, base64Img);				　　
//			});
//		});
	},
	getNovel: function(req, res, next) {
		getUtf8.returnNovel('https://www.ybdu.com/xiaoshuo/14/14278/4305561.html', res);
		//		request('https://www.ybdu.com/xiaoshuo/14/14278/4305561.html', function(error, response, body) {
		//			console.log('error:', error); // Print the error if one occurred
		//			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		//			console.log('body:', body); // Print the HTML for the Google homepage.
		//			res.json(body);
		//		});
	},
	getChapterContent: function(req, res, next) { //提取章节内容
		// 获取前台页面传过来的参数
		var param = req.query || req.params;
		getUtf8.returnNovel(param.url, param.id, res);
	},
	addNovelByUrl: function(req, res, next) { //根据前端传过来的url，解析小说内容并存储进数据库
		// 获取前台页面传过来的参数
		var param = req.query || req.params;
		getUtfTitle.returnNovel(param.id, param.url, res);
	},
	addNovelName: function(req, res, next) { //添加小说的名字
		pool.getConnection(function(err, connection) {
			// 获取前台页面传过来的参数
			var param = req.query || req.params;
			var timestamp = Date.parse(new Date());
			// 建立连接，向表中插入值
			// 'INSERT INTO booklist(name, creat_time, update_time) VALUES(?,?,?)',
			connection.query($sql.insertbooklist, [param.name, timestamp, timestamp], function(err, result) {
				if(result) {
					result = {
						code: 200,
						msg: '增加成功'
					};
				}

				// 以json形式，把操作结果返回给前台页面
				jsonWrite(res, result);

				// 释放连接 
				connection.release();
			});
		});
	},
	getContent: function(req, res, next) { //查询所选小说章节
		pool.getConnection(function(err, connection) {
			// 获取前台页面传过来的参数
			var param = req.query || req.params;
			try {
				// 建立连接
				//getContentById: 'select * from book_content where book_id=? limit ?,?',
				connection.query($sql.getContentById, [param.bookId, (Number(param.pageNo) - 1) * Number(param.pageSize), Number(param.pageSize)], function(err, result) {
					// 以json形式，把操作结果返回给前台页面
					jsonWrite(res, {
						code: 0,
						data: result
					});

					// 释放连接 
					connection.release();
				});
			} catch(e) {
				console.log(e);
				//TODO handle the exception
			}
		});
	},
	queryAllNovel: function(req, res, next) { //查询所有小说--展示所有小说的名字
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryAllbooklist, function(err, result) {
				jsonWrite(res, result);
				connection.release();
			});
		});
	},
	login: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			// 获取前台页面传过来的参数
			console.log(req.body);
			connection.query($sql.queryAll, function(err, result) {
				console.log(result);
				result.forEach(function(val) {
					console.log('val--' + val.name)
				})
				if(result) {
					result = {
						code: 200,
						msg: '登录成功'
					};
				}
				jsonWrite(res, result);
				connection.release();
			});
		});
	},
	add: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			// 获取前台页面传过来的参数
			var param = req.query || req.params;

			// 建立连接，向表中插入值
			// 'INSERT INTO user(name, age) VALUES(?,?)',
			connection.query($sql.insert, [param.name, param.age], function(err, result) {
				if(result) {
					result = {
						code: 200,
						msg: '增加成功'
					};
				}

				// 以json形式，把操作结果返回给前台页面
				jsonWrite(res, result);

				// 释放连接 
				connection.release();
			});
		});
	},
	delete: function(req, res, next) {
		// delete by Id
		pool.getConnection(function(err, connection) {
			var id = +req.query.id;
			connection.query($sql.delete, id, function(err, result) {
				if(result.affectedRows > 0) {
					result = {
						code: 200,
						msg: '删除成功'
					};
				} else {
					result = void 0;
				}
				jsonWrite(res, result);
				connection.release();
			});
		});
	},
	update: function(req, res, next) {
		// update by id
		// 为了简单，要求同时传name和age两个参数
		var param = req.body;
		if(param.name == null || param.age == null || param.id == null) {
			jsonWrite(res, undefined);
			return;
		}

		pool.getConnection(function(err, connection) {
			connection.query($sql.update, [param.name, param.age, +param.id], function(err, result) {
				// 使用页面进行跳转提示
				if(result.affectedRows > 0) {
					res.render('suc', {
						result: result
					}); // 第二个参数可以直接在jade中使用
				} else {
					res.render('fail', {
						result: result
					});
				}

				connection.release();
			});
		});

	},
	queryById: function(req, res, next) {
		var id = +req.query.id; // 为了拼凑正确的sql语句，这里要转下整数
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryById, id, function(err, result) {
				jsonWrite(res, result);
				connection.release();

			});
		});
	},
	queryAll: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryAll, function(err, result) {
				jsonWrite(res, result);
				connection.release();
			});
		});
	}

};