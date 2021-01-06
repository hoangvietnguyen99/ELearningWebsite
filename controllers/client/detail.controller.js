const express = require('express');
const router = express.Router();
const coursesModel = require('../../models/client/courses.model');
const userModel = require('../../models/client/users.model');
const lessonsModel = require('../../models/client/lessons.model');

exports.getCourses  = async function(req,res,next ){ 
    const course = await coursesModel.single(req.params.id);
    const user = await userModel.getNameAuthor(course.author);
    const lessons = await lessonsModel.getLessons(course.id);
    console.log(lessons);
    res.render('clients/DetailCourse', { 
        layout: 'layoutclient.hbs',
        course : course,
        user : user,
        lesson: lessons,
        empty: course.length == 0
    });
};
