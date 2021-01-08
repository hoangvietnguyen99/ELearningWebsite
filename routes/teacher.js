const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/client/editcourses.controller');

router.get('/editcourses', teacherController.getCourses);
module.exports = router;