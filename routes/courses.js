const express = require('express');
const router = express.Router();
const detailController = require('../controllers/client/detail.controller');
const lessonController = require('../controllers/client/lesson.controller');

router.route('/')
	.get()

router.route('/:id')
	.get(detailController.getCourses)
	
router.route('/:id/edit')
	.post(detailController.updateCourse)

router.route('/:id/lessons')
	.post(lessonController.addLesson)

router.route('/:id/lessons/:lid')
.delete(lessonController.deleteLesson)

module.exports = router;
