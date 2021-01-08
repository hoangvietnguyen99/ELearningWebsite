const express = require('express');
const router = express.Router();

const CourseController = require('../controllers/client/course.controller');

router.route('/')
	.get(CourseController.getAllAvailable);

module.exports = router;
