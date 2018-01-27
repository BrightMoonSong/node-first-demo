//http://blog.csdn.net/javajiawei/article/details/65935338?utm_source=tuicool&utm_medium=referral

var cheerio = require('cheerio');
var http = require('http');
var iconv = require('iconv-lite');
var htmlData = [];
var htmlDataLength = 0;
var count = 0;
 
http.globalAgent = 'Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1';
http.get('http://www.cr173.com', function(res) {
 
 res.on('data', function(data) {
 
  htmlData.push(data);
  htmlDataLength += data.length;
  count ++;
 });
 
 res.on('end',function(){
 
  callback(htmlData);
 });
 
});
 
function callback(htmlData){
 
 console.log(count);
 var bufferHtmlData = Buffer.concat(htmlData,htmlDataLength);
 var charset = '';
 var decodeHtmlData;
 var htmlHeadTitle = '';
 var htmlHeadCharset = '';
 var htmlHeadContent = '';
 var index = 0;
 
 var $ = cheerio.load(bufferHtmlData, {decodeEntities: false});
 
 $('meta','head').each(function(i, e) {
 
  htmlHeadCharset = $(e).attr('charset');
  htmlHeadContent = $(e).attr('content');
 
  if(typeof(htmlHeadCharset) != 'undefined'){
 
   charset = htmlHeadCharset;
  }
 
  if(typeof(htmlHeadContent) != 'undefined'){
 
   if(htmlHeadContent.match(/charset=/ig)){
 
    index = htmlHeadContent.indexOf('=');
    charset = htmlHeadContent.substring(index+1);
   }
  }
 });
 
 //此处为什么需要对整个网页进行转吗，是因为cheerio这个组件不能够返回buffer,iconv则无法转换之
 if(charset.match(/gb/ig)){
 
  decodeHtmlData = iconv.decode(bufferHtmlData,'gbk');
 }
 else{//因为有可能返回的网页中不存在charset字段，因此默认都是按照utf8进行处理
 
  decodeHtmlData = iconv.decode(bufferHtmlData,'utf8');
 }
 
 var $ = cheerio.load(decodeHtmlData, {decodeEntities: false});
 
 $('title','head').each(function(i, e) {
 
  htmlHeadTitle = $(e).text();
  console.log(htmlHeadTitle);
 });
 
 console.log(charset);
 
}