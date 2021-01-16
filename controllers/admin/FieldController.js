const express = require('express');
const router = express.Router();
const FieldModel = require('../../models/admin/FieldModel')
const CategoryModel = require('../../models/admin/CategoryModel')

exports.index = async(req, res, next) => {
    try {
        const rows = await FieldModel.all()
        res.render('admin/fields/index', {
            layout: 'layoutadmin.hbs',
            fields: rows,
            empty: rows.length === 0,
            title: 'Field'
        });
    } catch (error) {
        console.log(error)
    }
}

exports.getAdd = async(req, res, next) => {
    const categories = await CategoryModel.all()
    res.render('admin/fields/add', {
        layout: 'layoutadmin.hbs',
        categories: categories,
        title: 'Add Field'
    });
}

exports.postAdd = async(req, res, next) => {
    var data = req.body
    data.imgpath = `/assets/admin/images/fields/${req.file.originalname}`
    const ret = await FieldModel.add(data);
    res.render('admin/fields/add', {
        layout: 'layoutadmin.hbs',
    });
}

exports.getUpdate = async(req, res, next) => {
    const field = await FieldModel.single(req.params.id)
    if (field === null) {
        return res.redirect('/admin/field')
    }
    var canDelete = true
    const courses = await FieldModel.courses(req.params.id)
    if (courses.length > 0)
        canDelete = false
    const categories = await CategoryModel.except(field.categoryid)
    res.render('admin/fields/update', {
        layout: 'layoutadmin.hbs',
        field: field,
        categories: categories,
        title: 'Update Field',
        canDelete: canDelete
    });
}

exports.postUpdate = async(req, res, next) => {
    var data = req.body
    if (req.file)
        data.imgpath = `/assets/admin/images/fields/${req.file.originalname}`
    const ret = await FieldModel.update(data);
    res.redirect('/admin/field')
}

exports.delete = async(req, res, next) => {
    const courses = await FieldModel.courses(req.params.id)
    if (courses.length > 0)
        console.log("This Field already has Course and cannot be deleted")
    else
        var ret = await FieldModel.del(req.params);
    res.redirect('/admin/field')
}