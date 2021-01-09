const express = require('express');
const router = express.Router();
const detailController = require('../controllers/client/detail.controller');
const lessonController = require('../controllers/client/lesson.controller');

router.route('/')
	.get()

router.route('/:id')
	.get(detailController.getCourses)
	

router.route('/:id/lessons')
	.post(lessonController.addLesson)

module.exports = router;
