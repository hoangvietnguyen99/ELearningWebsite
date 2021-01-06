const express = require('express');
const router = express.Router();
const categoryModel = require('../models/client/categories.model');
const accountModel = require('../models/client/account.model');
const course_discountModel = require('../models/client/course_discount.model');
const coursesModel = require('../models/client/courses.model');
const discountsModel = require('../models/client/discounts.model');
const field_courseModel = require('../models/client/field_course.model');
const fieldsModel = require('../models/client/fields.model');
const lessonsModel = require('../models/client/lessons.model');
const ratingsModel = require('../models/client/ratings.model');
const rolesModel = require('../models/client/roles.model');
const statusesModel = require('../models/client/statuses.model');
const user_courseModel = require('../models/client/user_course.model');
const detailController = require('../controllers/client/detail.controller');

//Index
router.get('/', function(req, res, next) {
	res.render('clients/index', { layout: 'layoutclient.hbs' });
});
router.get('/detail/:id', async function(req, res, next) {
  detailController.getCourses(req,res,next);
});
router.get('/categories', function(req, res, next) {
	res.render('clients/categories', { layout: 'layoutclient.hbs' });
});

router.get('/courses', function(req, res, next) {
	res.render('clients/courses', { layout: 'layoutclient.hbs' });
});

router.get('/editor', function(req, res, next) {
	res.render('clients/editor', { layout: 'layoutclient.hbs' });
});

router.post('/editor', function(req,res,next){
  console.log(req.body.Des);
  res.render('clients/editor', { layout: 'layoutclient.hbs' });
});


//User
router.get('/user', function(req, res, next) {
	res.send('respond with a resource');
});


module.exports = router;
