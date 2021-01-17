const express = require('express');
const router = express.Router();
const lessonsModel = require('../../models/lesson.model');
const multer = require('multer');
const user_courseModel = require('../../models/user_course.model');

exports.addLesson =  async function(req,res,next){
    const courseID = req.params.id;
    const {title,Des} = req.body;
    const lesson = {
        title,
        courseid: courseID,
        description: Des
    }
    const result = await lessonsModel.addOneByCourseId(lesson);

    if(result !== null)
    res.redirect('/courses/' + courseID);
};

exports.deleteLesson =  async function(req,res,next){
    const lessonID = req.params.lid;
    const courseID = req.params.id;
    const result = await lessonsModel.removeLesson(lessonID);
    if(result !== null)
    res.redirect('/courses/' + courseID);
};

exports.editLesson =  async function(req,res,next){
    const lessonID = req.params.lid;
    const courseID = req.params.id;
    const {title,des} = req.body;
    lesson = {
        title,
        description :des,
        id: lessonID,
        courseid: courseID
    }
    const result = await lessonsModel.updateLesson(lesson);
    if(result !== null)
    res.redirect('/courses/' + courseID);
};

exports.addVideo =  async function(req,res,next ){
    const storage = multer.diskStorage({
		destination: function (req, file, cb) {
		  cb(null, './public/assets/client/videos')
		},
		filename: async function (req, file, cb) {
      
      const url = {
        videourl: '/assets/client/videos/' + file.originalname.replace(/\s/g, '')
      }
      const result = await lessonsModel.updateVideoUrl(req.params.lid,url);
		  cb(null, file.originalname.replace(/\s/g, ''));
		}
    });
    

	  const upload = multer({ storage });
	  // upload.single('fuMain')(req, res, function (err) {
    await upload.array('fuMain',1)(req, res, function (err) {
		if (err) {
			console.log('Error load');
		} else {
			res.redirect('/courses/'+ req.params.id);
		}
	  });
};

exports.saveCurrentimeVideo = async function(req,res,next){
  const currentpause = {
    currentlesson: req.params.lid,
    currentpause: parseFloat(req.body.pause)
  }
  console.log(currentpause);
  const result = await user_courseModel.updateTimePause(req.session.authUser.id,currentpause);
  if(result!==null) console.log('Save time pause');
};