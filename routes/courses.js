const express = require('express');
const router = express.Router();

const { isAuth } = require('../middlewares/Authentication');
const courseController = require('../controllers/client/course.controller');
const lessonController = require('../controllers/client/lesson.controller');

router.route('/')
    .get(courseController.getAllAvailable);

router.route('/:id')
    .get(courseController.getCourse);

router.route('/:id/lessons')
	.post(lessonController.addLesson);
	
router.route('/:courseid/reviews')
    .post(isAuth, courseController.addReview);




router.route('/:id/lessons/:lid')
	.put(lessonController.editLesson)
	.post(lessonController.addVideo);
	
router.route('/:id/lessons/:lid/:orderid')
	.put(lessonController.saveCurrentimeVideo);

router.route('/:id/lessons/:lid/:orderid/ended')
	.put(lessonController.endVideo)


module.exports = router;
