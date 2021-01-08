const express = require('express');
const router = express.Router();
const coursesModel = require('../../models/course.model');

exports.getCourses  = async function(req,res,next ){ 
    const user = req.session.authUser;
    const courses = await coursesModel.allByAuthor(user.id);
    res.render('clients/listCourses', { 
        layout: 'layoutclient.hbs',
        courses : courses,
        empty: courses.length == 0
    });
};
