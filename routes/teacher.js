const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/client/editcourses.controller');
const {isTeacher} = require('../middlewares/Authentication');

// router.get('/editcourses',isTeacher,teacherController.getCourses);
router.route('/courses')
.get(teacherController.getCourses);

router.route('/courses/:id')
.get()
.post(teacherController.addImage)
.put()

module.exports = router;