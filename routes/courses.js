const express = require('express');
const router = express.Router();

const CourseController = require('../controllers/client/course.controller');

router.route('/')
	.get(CourseController.getAllAvailable);

router.route('/:courseid/reviews')
	.post(CourseController.addReview);

module.exports = router;
