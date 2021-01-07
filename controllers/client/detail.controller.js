const express = require('express');
const router = express.Router();
const coursesModel = require('../../models/course.model');
const userModel = require('../../models/user.model');
const lessonsModel = require('../../models/lesson.model');

exports.getCourses  = async function(req,res,next ){ 
    const course = await coursesModel.single(req.params.id);
    const user = await userModel.getNameAuthor(course.author);
    const lessons = await lessonsModel.getLessons(course.id);
    res.render('clients/DetailCourse', { 
        layout: 'layoutclient.hbs',
        course : course,
        user : user,
        lesson: lessons,
        empty: course.length == 0
    });
};
