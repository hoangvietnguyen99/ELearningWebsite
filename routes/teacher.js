const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/client/editcourses.controller');
const {isTeacher} = require('../middlewares/Authentication');
const detailController = require('../controllers/client/detail.controller');

// router.get('/editcourses',isTeacher,teacherController.getCourses);
router.route('/courses')
.get(teacherController.getCourses)
.post(teacherController.addCourse)

router.route('/courses/:id')
.get()
.post(teacherController.addImage)
.put()
.delete(teacherController.deleteCourse)

module.exports = router;