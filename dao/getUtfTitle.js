var cheerio = require('cheerio');
var http = require('https');
var iconv = require('iconv-lite');
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./userSqlMapping');

// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, $conf.mysql));
var htmlData = [];
var htmlDataLength = 0;
var count = 0;

http.globalAgent = 'Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1';
var returnNovel = function(id, url, parRes) {
	//	console.log('id,url');
	//	console.log(id, url);
	http.get(url, function(res) {
		res.on('data', function(data) {

			htmlData.push(data);
			htmlDataLength += data.length;
			count++;
		});

		res.on('end', function() {
			var bufferHtmlData = Buffer.concat(htmlData, htmlDataLength);
			decodeHtmlData = iconv.decode(bufferHtmlData, 'gbk');

			var $ = cheerio.load(decodeHtmlData, {
				decodeEntities: false
			});
			$('.mulu_list', 'body').each(function(i, e) {
				html = $(e).html();
				var arr = html.split('<li><a href=');
				try {
					pool.getConnection((err, connection) => {
						var timestamp = Date.parse(new Date());
						var numSuc = 0;
						arr.forEach((val) => {
							numSuc++;
							if(val.indexOf('.html">第') >= 0) {
								var numUrl = val.split('.html">')[0].split('\"')[1];
								var title = val.split('.html">')[1].split('</a></li>')[0];

								// 建立连接，向表中插入值
								//insertcontent: 'INSERT INTO book_content(book_id, title, content,source, creat_time, update_time) VALUES(?,?,?,?,?,?)',
								connection.query($sql.insertcontent, [id, title, '', '' + url + numUrl + '.html', timestamp, timestamp], (err, result) => {
									if(err) {
										console.log(err)
										return false;
									}
									if(result) {
										//numSuc++;
									}
								});
							}
						});

						parRes.json({
							code: 200,
							msg: '增加成功'
						});
						// 释放连接 
						connection.release();
					});
				} catch(e) {
					console.log(e);
					//TODO handle the exception
				}
			});
		});

	});
}
//去掉字符串中所有空格(包括中间空格,需要设置第2个参数为:g)
function Trim(str, is_global) {
	var result;
	result = str.replace(/(^\s+)|(\s+$)/g, "");
	if(is_global.toLowerCase() == "g") {
		result = result.replace(/\s/g, "");
	}
	return result;
}

module.exports = {
	returnNovel: returnNovel
};