const courseModel = require('../../models/course.model');
const multer = require('multer');
const user_courseModel = require('../../models/user_course.model');
const lessonModel = require('../../models/lesson.model');

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
	const result = await lessonModel.addOneByCourseId(lesson);
	if (result !== null) {
		await courseModel.update(thisCourse);
		res.redirect('/courses/' + courseID);
	}
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
	const result = await lessonModel.updateLesson(lesson);
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
			const result = await lessonModel.updateVideoUrl(req.params.lid, url);
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

exports.saveCurrentimeVideo = async function(req, res){
	const userCourse = await user_courseModel.getOneByLessonID(req.session.authUser.id,req.params.id,req.params.lid);
	if (!userCourse || userCourse.process == userCourse.lessonorder) {
		return;
	}
  const currentpause = {
    userid: req.session.authUser.id,
    courseid: req.params.id,
    currentlesson: req.params.lid,
    currentpause: parseFloat(req.body.pause),
    lessonorder: parseInt(req.params.orderid)
  }
  const result = await user_courseModel.updateOne(currentpause);
  if(result !== null) console.log('Save time pause');
};

exports.endVideo = async function(req,res){
  const userCourse = await user_courseModel.getOneByLessonID(req.session.authUser.id,req.params.id,req.params.lid);
  if (!userCourse || userCourse.process == userCourse.lessonorder) {
  	return;
  }
  const process = {
    userid: req.session.authUser.id,
    courseid: req.params.id,
    process: req.params.orderid
  }
  const updateEnd = await user_courseModel.updateOne(process);
  const nextlesson = await lessonModel.getNextLesson(userCourse.courseid,userCourse.lessonorder);
  if(nextlesson){
    const update = {
      userid: req.session.authUser.id,
      courseid: req.params.id,
	 //process: req.params.lid,
	  process: req.params.orderid,
      currentlesson: nextlesson.id,
      lessonorder: nextlesson.order,
      currentpause: 0
    }
    const result = await user_courseModel.updateOne(update);
    return res.status(200).send({result: 'redirect', url:+ req.params.id});
  }
  else{
	return res.status(200).send({result: 'redirect', url:+ req.params.id});
  }
}
