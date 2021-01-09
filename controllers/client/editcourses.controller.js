const express = require('express');
const router = express.Router();
const coursesModel = require('../../models/course.model');
const multer = require('multer');
const db = require('../../utils/database');
const courseModel = require('../../models/course.model');
const fieldModel = require('../../models/field.model');
const fieldCourseModel = require('../../models/field_course.model');

exports.getCourses  = async function(req,res,next ){
    const user = req.session.authUser;
    const courses = await coursesModel.allByAuthor(user.id);
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
    // const courses = await coursesModel.allByAuthor(author);
    // const fields  = await fieldModel.getAll();
    // for(let i = 0; i < selection.length;i++){
    //   console.log(selection[i]);
    //   console.log(fields.name);
    //   if(selection[i]===fields.name){
    //     for(let j = 0; j < courses.length;j++){
    //       if(courses.name === name){
    //         console.log(fields.id);
    //         console.log(courses.id);
    //         const resu = await fieldCourseModel.addOne(fields.id,courses.id)
    //       }
    //     }
    //   }
    // }
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
  const course =  {
    id : req.params.id
  }
  const result = await courseModel.delete(course);
  if(result !== null)
    res.redirect('/teacher/courses');
}