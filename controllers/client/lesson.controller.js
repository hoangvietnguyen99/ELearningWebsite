const lessonsModel = require('../../models/lesson.model');
const courseModel = require('../../models/course.model');
const multer = require('multer');

exports.addLesson = async function (req, res, next) {
	const courseID = req.params.id;
	const thisCourse = await courseModel.getByIdAvailable(courseID);
	if (!thisCourse) return res.redirect(req.headers.referer || '/');
	const {title, Des} = req.body;
	const lesson = {
		title,
		courseid: courseID,
		description: Des,
		order: thisCourse.currenlessonorder
	}
	thisCourse.currenlessonorder++;
	thisCourse.lessonscount = thisCourse.lessonscount < lesson.order + 1 ? lesson.order + 1 : thisCourse.lessonscount;
	const result = await lessonsModel.addOneByCourseId(lesson);
	if (result !== null) {
		await courseModel.update(thisCourse);
		res.redirect('/courses/' + courseID);
	}
};

exports.deleteLesson = async function (req, res, next) {
	const lessonID = req.params.lid;
	const courseID = req.params.id;
	const result = await lessonsModel.removeLesson(lessonID);
	if (result !== null)
		res.redirect('/courses/' + courseID);
};

exports.editLesson = async function (req, res, next) {
	const lessonID = req.params.lid;
	const courseID = req.params.id;
	const {title, des} = req.body;
	lesson = {
		title,
		description: des,
		id: lessonID,
		courseid: courseID
	}
	console.log(lesson);
	const result = await lessonsModel.updateLesson(lesson);
	if (result !== null)
		res.redirect('/courses/' + courseID);
};

exports.addVideo = async function (req, res, next) {
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, './public/assets/client/videos')
		},
		filename: async function (req, file, cb) {

			const url = {
				videourl: '/assets/client/videos/' + file.originalname.replace(/\s/g, '')
			}
			const result = await lessonsModel.updateVideoUrl(req.params.lid, url);
			cb(null, file.originalname.replace(/\s/g, ''));
		}
	});


	const upload = multer({storage});
	// upload.single('fuMain')(req, res, function (err) {
	await upload.array('fuMain', 1)(req, res, function (err) {
		if (err) {
			console.log('Error load');
		} else {
			res.redirect('/courses/' + req.params.id);
		}
	});
};
