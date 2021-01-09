const express = require('express');
const router = express.Router();
const lessonsModel = require('../../models/lesson.model');

exports.addLesson =  async function(req,res,next){
    console.log("AAAAAAAAA");
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