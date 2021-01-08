const express = require('express');
const router = express.Router();
const coursesModel = require('../../models/course.model');
const multer = require('multer');

exports.getCourses  = async function(req,res,next ){ 
    const user = req.session.authUser;
    const courses = await coursesModel.allByAuthor(user.id);
    res.render('clients/listCourses', { 
        layout: 'layoutclient.hbs',
        courses : courses,
        empty: courses.length == 0
    });
};

exports.addImage =  function(req,res,next ){ 
    const storage = multer.diskStorage({
		destination: function (req, file, cb) {
		  cb(null, './public/assets/client/images/courses')
		},
		filename: function (req, file, cb) {
		  cb(null, req.params.id + `.png`)
		}
	  });
	  const upload = multer({ storage });
	  // upload.single('fuMain')(req, res, function (err) {
	  upload.array('fuMain',1)(req, res, function (err) {
		if (err) {
			console.log('Error load');
		} else {
			res.render('clients/editor', { layout: 'layoutclient.hbs' });
		}
	  });
};
