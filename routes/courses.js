const express = require('express');
const router = express.Router();

const { isAuth } = require('../middlewares/Authentication');
const courseController = require('../controllers/client/course.controller');
const lessonController = require('../controllers/client/lesson.controller');

router.route('/')
    .get(courseController.getAllAvailable);

router.route('/:id')
    .get(courseController.getCourse)

router.route('/:courseid/reviews')
    .post(isAuth, courseController.addReview);

router.route('/:id/lessons')
	.post(lessonController.addLesson)
		

router.route('/:id/lessons/:lid')
	.delete(lessonController.deleteLesson)
	.put(lessonController.editLesson)
	.post(lessonController.addVideo)
	
	
router.route('/:id/lessons/:lid/:orderid')
	.put(lessonController.saveCurrentimeVideo)
module.exports = router;