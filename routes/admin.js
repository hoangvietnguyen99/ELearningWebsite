const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/admin/CourseController')
const CategoryController = require('../controllers/admin/CategoryController')
const UserController = require('../controllers/admin/UserController')

//Index
router.get('/', function(req, res, next) {
    res.render('admin/index', { layout: 'layoutadmin.hbs' });
  });

//Category
router.get('/category', async function(req, res, next) {
  CategoryController.index(req, res, next)
});
router.get('/category/add', async function(req, res, next) {
  CategoryController.getAdd(req, res, next)
});
router.post('/category/add', async function(req, res, next) {
  CategoryController.postAdd(req, res, next)
});
router.get('/category/update/:id', async function(req, res, next) {
  CategoryController.getUpdate(req, res, next)
});
router.post('/category/update', async function(req, res, next) {
  CategoryController.postUpdate(req, res, next)
});
router.post('/category/delete', async function(req, res, next) {
  CategoryController.delete(req, res, next)
});

//User
router.get('/user', async function(req, res, next) {
  UserController.index(req, res, next)
});
router.get('/user/add', async function(req, res, next) {
  UserController.getAdd(req, res, next)
});

//Course
router.get('/course', async function(req, res, next) {
  CourseController.index(req, res, next)
});
router.get('/course/add', async function(req, res, next) {
  CourseController.getAdd(req, res, next)
});
router.post('/course/add', async function(req, res, next) {
  CourseController.postAdd(req, res, next)
});
router.get('/course/update/:id', async function(req, res, next) {
  CourseController.getUpdate(req, res, next)
});
router.post('/course/update', async function(req, res, next) {
  CourseController.postUpdate(req, res, next)
});
router.post('/course/delete', async function(req, res, next) {
  CourseController.delete(req, res, next)
});

module.exports = router;