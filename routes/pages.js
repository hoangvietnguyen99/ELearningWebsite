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
const usersModel = require('../models/client/users.model');

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
  
//test
router.get('/categories', async function(req,res,next){
  const category = await categoryModel.all();
  const account = await accountModel.all();
  const course_discount = await course_discountModel.all();
  const courses = await coursesModel.all();
  const discounts = await discountsModel.all();
  const field_course = await field_courseModel.all();
  const fields = await fieldsModel.all();
  const lessons = await lessonsModel.all();
  const ratings = await ratingsModel.all();
  const roles = await rolesModel.all();
  const statuses = await statusesModel.all();
  const user_course = await user_courseModel.all();
  const users = await usersModel.all();

  console.log(category);
  console.log(account);
  console.log(course_discount);
  console.log(courses);
  console.log(discounts);
  console.log(field_course);
  console.log(fields);
  console.log(lessons);
  console.log(ratings);
  console.log(roles);
  console.log(statuses);
  console.log(user_course);
  console.log(users);

  res.render('clients/categories',{
    layout: 'layoutclient.hbs',
  });
});
module.exports = router;