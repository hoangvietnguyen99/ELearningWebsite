const express = require('express');
const router = express.Router();
const UserModel = require('../../models/admin/UserModel')
const CourseModel = require('../../models/admin/CourseModel')
const FieldModel = require('../../models/admin/FieldModel');
const { json } = require('body-parser');

exports.index = async(req, res, next) => {
    try {
        const fields = await FieldModel.all() 
        const teachers = await UserModel.getByRole('TEACHER')
        const rows = await CourseModel.all(req.query)
        
        res.render('admin/courses/index', {
            layout: 'layoutadmin.hbs',
            courses: rows,
            fields: fields,
            teachers: teachers,
            //empty: rows.length === 0,
            title: 'Course'
        });
    } catch (error) {
        console.log(error)
    }
}


exports.postUpdate = async(req, res, next) => {
    try{
        var data = {}
        var result = {status: true}
        data.id = req.params.id
        if(req.body.status == 'disabled')
            data.approvedby = null
        else
        {
            data.approvedby = req.session.authUser.id
            result.approvedbyname = req.session.authUser.fullname
        }
        await CourseModel.update(data)
        return res.end(JSON.stringify(result))
    }catch
    {
        return res.end(JSON.stringify({status: false}))
    }

}

exports.approve = async(req, res, next) => {
    if (req.session.authUser.id) {
        var data = {}
        data.id = req.params.id
        data.approvedby = req.session.authUser.id
        const ret = await CourseModel.update(data);
    }

    res.redirect('/admin/course')
}

