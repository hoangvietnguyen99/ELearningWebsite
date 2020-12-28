const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/admin/CategoryController')
const UserController = require('../controllers/admin/UserController')

//Index
router.get('/', function(req, res, next) {
    res.render('admin/index', { layout: 'layoutadmin.hbs' });
  });

router.get('/category', async function(req, res, next) {
  CategoryController.index(req, res, next)
});

router.get('/user', async function(req, res, next) {
  UserController.index(req, res, next)
});
module.exports = router;