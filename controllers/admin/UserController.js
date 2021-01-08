const express = require('express');
const router = express.Router();
const UserModel = require('../../models/admin/UserModel')

exports.index = async(req, res, next) => {
    try {
        const rows = await UserModel.all()
        res.render('admin/users/index', {
            layout: 'layoutadmin.hbs',
            users: rows,
            empty: rows.length === 0
        });
    } catch (error) {
        console.log(error)
    }
}