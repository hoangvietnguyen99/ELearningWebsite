const express = require('express');
const router = express.Router();
const UserModel = require('../../models/admin/UserModel')

exports.index = async(req, res, next) => {
    try {
        const rows = await UserModel.all(req.query)
        res.render('admin/users/index', {
            layout: 'layoutadmin.hbs',
            users: rows,
            empty: rows.length === 0,
            title: 'User'
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

