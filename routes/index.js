var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '首页' });
});
/* login */
router.get('/login', function(req, res, next) {
  res.render('login', { title: '登录' });
});
/* 管理页面 */
router.get('/manager', function(req, res, next) {
  res.render('manager', { title: '管理页面' });
});

module.exports = router;
