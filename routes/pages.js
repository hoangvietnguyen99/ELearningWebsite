const express = require('express');
const router = express.Router();
const detailController = require('../controllers/client/detail.controller');
const multer = require('multer');

//Index
router.get('/', function(req, res, next) {
	res.render('clients/index', { layout: 'layoutclient.hbs' });
});
// router.get('/detail/:id', async function(req, res, next) {
//   detailController.getCourses(req,res,next);
// });
// router.get('/categories', function(req, res, next) {
// 	res.render('clients/categories', { layout: 'layoutclient.hbs' });
// });
//
// router.get('/courses', function(req, res, next) {
// 	res.render('clients/courses', { layout: 'layoutclient.hbs' });
// });
//
// router.get('/editor', function(req, res, next) {
// 	res.render('clients/editor', { layout: 'layoutclient.hbs' });
// });
//
// router.post('/editor', function(req,res,next){
//
// 	const storage = multer.diskStorage({
// 		destination: function (req, file, cb) {
// 		  cb(null, './public/assets/client/images/courses')
// 		},
// 		filename: function (req, file, cb) {
// 		  cb(null, file.originalname)
// 		}
// 	  });
// 	  const upload = multer({ storage });
// 	  // upload.single('fuMain')(req, res, function (err) {
// 	  upload.array('fuMain', 3)(req, res, function (err) {
// 		console.log(req.body);
// 		if (err) {
// 			console.log('Error load');
// 		} else {
// 			res.render('clients/editor', { layout: 'layoutclient.hbs' });
// 		}
// 	  });
// });
//
// router.post('/editor', function(req,res,next){
// 	console.log(res.body.Des);
// 	res.render('clients/editor', { layout: 'layoutclient.hbs' });
// });
//
// //User
// router.get('/user', function(req, res, next) {
// 	res.send('respond with a resource');
// });

module.exports = router;
