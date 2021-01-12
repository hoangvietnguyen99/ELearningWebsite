const express = require('express');
const router = express.Router();
const UserModel = require('../../models/admin/UserModel')
const CourseModel = require('../../models/admin/CourseModel')

exports.index = async(req, res, next) => {
    try {
        const rows = await CourseModel.all()
        res.render('admin/courses/index', {
            layout: 'layoutadmin.hbs',
            courses: rows,
            empty: rows.length === 0,
            title: 'Course'
        });
    } catch (error) {
        console.log(error)
    }
}

exports.getUpdate = async(req, res, next) => {
    const user = await UserModel.single(req.params.id)
    if (user === null) {
        return res.redirect('/admin/user')
    }

    res.render('admin/users/update', {
        layout: 'layoutadmin.hbs',
        user: user,
        title: 'Update Role & Status'
    });
}

exports.postUpdate = async(req, res, next) => {
    // console.log(req.body)
    const ret = await UserModel.update(req.body);
    res.redirect('/admin/user')
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