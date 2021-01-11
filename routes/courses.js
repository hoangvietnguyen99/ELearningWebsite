const express = require('express');
const router = express.Router();

const courseController = require('../controllers/client/course.controller');
const lessonController = require('../controllers/client/lesson.controller');

router.route('/')
	.get(courseController.getAllAvailable);

router.route('/:id')
	.get(courseController.getCourses)

router.route('/:courseid/reviews')
	.post(courseController.addReview);

router.route('/:id/lessons')
	.post(lessonController.addLesson)

router.route('/:id/lessons/:lid')
	.delete(lessonController.deleteLesson)

router.route('/:id/lessons/:lid/edit')
	.post(lessonController.editLesson)

module.exports = router;
