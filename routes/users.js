var express = require('express');
var router = express.Router();

var userDao = require('../dao/userDao');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

// 增加用户
//TODO 同时支持get,post
router.get('/addUser', function(req, res, next) {
	userDao.add(req, res, next);
});

//getimg
router.get('/getimg', function(req, res, next) {
	userDao.getimg(req, res, next);
});

//登录
router.post('/login', function(req, res, next) {
	userDao.login(req, res, next);
});

//提取章节内容
router.get('/getChapterContent', function(req, res, next) {
	userDao.getChapterContent(req, res, next);
});

//得到小说章节
router.get('/getContent', function(req, res, next) {
	userDao.getContent(req, res, next);
});

//得到小说数据
router.get('/getNovel', function(req, res, next) {
	userDao.getNovel(req, res, next);
});

//储存小说数据--根据前端传过来的url，解析小说内容并存储进数据库
router.get('/addNovel', function(req, res, next) {
	userDao.addNovelByUrl(req, res, next);
});

//储存小说名字
router.get('/addNovelName', function(req, res, next) {
	userDao.addNovelName(req, res, next);
});

//查询所有数据---小说名字
router.get('/queryAllNovel', function(req, res, next) {
	userDao.queryAllNovel(req, res, next);
});

//查询所有数据
router.get('/queryAll', function(req, res, next) {
	userDao.queryAll(req, res, next);
});

//查询数据详情根据ID
router.get('/query', function(req, res, next) {
	userDao.queryById(req, res, next);
});

//删除数据根据ID
router.get('/deleteUser', function(req, res, next) {
	userDao.delete(req, res, next);
});

//更新数据根据ID
router.post('/updateUser', function(req, res, next) {
	userDao.update(req, res, next);
});

module.exports = router;