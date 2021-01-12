const express = require('express');
const router = express.Router();
const lessonsModel = require('../../models/lesson.model');
const multer = require('multer');

exports.addLesson =  async function(req,res,next){
    const courseID = req.params.id;
    console.log(courseID );
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
    console.log(lesson);
    const result = await lessonsModel.updateLesson(lesson);
    if(result !== null)
    res.redirect('/courses/' + courseID);
};

exports.addVideo =  function(req,res,next ){
    const storage = multer.diskStorage({
		destination: function (req, file, cb) {
		  cb(null, './public/assets/client/videos')
		},
		filename: function (req, file, cb) {
		  cb(null, req.params.lid + `.webm`)
		}
	  });
	  const upload = multer({ storage });
	  // upload.single('fuMain')(req, res, function (err) {
	  upload.array('fuMain',1)(req, res, function (err) {
		if (err) {
			console.log('Error load');
		} else {
			res.redirect('/courses/'+ req.params.id);
		}
	  });
};