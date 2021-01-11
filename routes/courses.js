const express = require('express');
const router = express.Router();

const CourseController = require('../controllers/client/course.controller');

router.route('/')
	.get(CourseController.getAllAvailable);

router.route('/:id')
	.get(detailController.getCourses)

router.route('/:courseid/reviews')
	.post(CourseController.addReview);

router.route('/:id/lessons')
	.post(lessonController.addLesson)

router.route('/:id/lessons/:lid')
	.delete(lessonController.deleteLesson)

router.route('/:id/lessons/:lid/edit')
	.post(lessonController.editLesson)

module.exports = router;
