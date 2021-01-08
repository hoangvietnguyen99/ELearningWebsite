const express = require('express');
const router = express.Router();
const detailController = require('../controllers/client/detail.controller');

router.route('/')
	.get()

router.route('/:id')
	.get(detailController.getCourses)
module.exports = router;
