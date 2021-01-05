const express = require('express');
const router = express.Router();
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
<<<<<<< HEAD
<<<<<<< HEAD
router.post('/user/add', async function(req, res, next) {
  UserController.postAdd(req, res, next)
});
module.exports = router;
=======
module.exports = router;
>>>>>>> parent of b0d02b2... oke
=======
module.exports = router;
>>>>>>> parent of b0d02b2... oke
