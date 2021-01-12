const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/client/editcourses.controller');

router.route('/courses')
	.get(teacherController.getCourses)
	.post(teacherController.addCourse)

router.route('/courses/:id')
.post(teacherController.addImage)
.delete(teacherController.deleteCourse)
.put(teacherController.updateCourse)

module.exports = router;
