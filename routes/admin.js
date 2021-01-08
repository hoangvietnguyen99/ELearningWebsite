const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/admin/CategoryController')
const FieldController = require('../controllers/admin/FieldController')
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

//Field
router.get('/field', async function(req, res, next) {
    FieldController.index(req, res, next)
});
router.get('/field/add', async function(req, res, next) {
    FieldController.getAdd(req, res, next)
});
router.post('/field/add', async function(req, res, next) {
    FieldController.postAdd(req, res, next)
});
router.get('/field/update/:id', async function(req, res, next) {
    FieldController.getUpdate(req, res, next)
});
router.post('/field/update', async function(req, res, next) {
    FieldController.postUpdate(req, res, next)
});
router.post('/field/delete', async function(req, res, next) {
    FieldController.delete(req, res, next)
});

//User
router.get('/user', async function(req, res, next) {
    UserController.index(req, res, next)
});
module.exports = router;