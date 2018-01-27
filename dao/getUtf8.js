var cheerio = require('cheerio');
var http = require('https');
var iconv = require('iconv-lite');
var htmlData = [];
var htmlDataLength = 0;
var count = 0;
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./userSqlMapping');

// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, $conf.mysql));

http.globalAgent = 'Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1';
var returnNovel = function(url, id, parRes) {
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
			var htmlHeadTitle;
			$('title', 'head').each(function(i, e) {
				htmlHeadTitle = $(e).text();
			});
			$('#htmlContent', 'body').each(function(i, e) {
				html = $(e).text();
				var str = html.split('(未完待续……)')[0];
				str = Trim(str, 'g');
				pool.getConnection((err, connection) => {
					var timestamp = Date.parse(new Date());
					// 建立连接，
					//updateContent: 'update book_content set content=?, update_time=? where id=?',
					connection.query($sql.updateContent, [str, timestamp, id], (err, result) => {
						if(err) {
							console.log(err)
							return false;
						}

					});

					// 释放连接 
					connection.release();
					var result = {
						code: 0,
						msg: '提取' + htmlHeadTitle + '成功'
					};
					parRes.json(result);
				});
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