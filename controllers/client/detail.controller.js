const express = require('express');
const router = express.Router();
const coursesModel = require('../../models/course.model');
const userModel = require('../../models/user.model');
const lessonsModel = require('../../models/lesson.model');

exports.getCourses  = async function(req,res,next ){ 
    const course = await coursesModel.getById(req.params.id);
    const user = await userModel.getNameAuthor(course.author);
    const lessons = await lessonsModel.getAllByCourseId(course.id);
    res.render('clients/DetailCourse', { 
        layout: 'layoutclient.hbs',
        course : course,
        user : user,
        lesson: lessons,
        empty: course.length == 0,
        isAuthor: res.locals.authUser.id === course.author
    });
}

exports.updateCourse = async function(req,res,next){
    
    const author = req.session.authUser.id;
    const {name,number,price,Des,selection} = req.body;
    const course = {
        id: req.params.id,
        name: name,
        author: author,
        lessonscount: number,
        price: price,
        description: Des
    }
    console.log(req.params.id);
    const result = await coursesModel.update(course);
    if(result !== null)
    res.redirect('/courses/' + req.params.id);
}