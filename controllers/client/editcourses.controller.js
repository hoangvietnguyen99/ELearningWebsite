const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../../utils/database');
const courseModel = require('../../models/course.model');
const fieldModel = require('../../models/field.model');
const fieldCourseModel = require('../../models/field_course.model');

exports.getCourses  = async function(req,res,next ){
    const user = req.session.authUser;
    const courses = await courseModel.allByAuthor(user.id);
    const fields  = await fieldModel.getAll();
    res.render('clients/listCourses', {
        layout: 'layoutclient.hbs',
        courses : courses,
        fields: fields,
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
			res.redirect('/teacher/courses');
		}
	  });
};

exports.addCourse =  async function(req,res,next){
    const author = req.session.authUser.id;
    const {name,number,price,Des,selection} = req.body;
    const course = {
        name: name,
        author: author,
        lessonscount: number,
        price: price,
        description: Des
    }
    const result = await courseModel.addOne(course);
    if(result !== null)
    res.redirect('/teacher/courses');
};

exports.deleteCourse = async function(req,res,next){
  console.log("BBBBBB");
  console.log(req.params.id);
  const result = await courseModel.removeCourse(req.params.id);
  if(result !== null)
  //res.send({status: true, url: "/teacher/courses"});
  res.redirect('/teacher/courses');
};