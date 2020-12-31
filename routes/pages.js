const express = require('express');
const router = express.Router();

//Index
router.get('/', function(req, res, next) {
	res.render('clients/index', { layout: 'layoutclient.hbs' });
});
router.get('/detail', function(req, res, next) {
	res.render('clients/DetailCourse', { layout: 'layoutclient.hbs' });
});
router.get('/login', function(req, res, next) {
  res.render('auth/auth.hbs', { layout: false });
});

//User
router.get('/user', function(req, res, next) {
	res.send('respond with a resource');
});

module.exports = router;
