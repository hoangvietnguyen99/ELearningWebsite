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
            empty: rows.length === 0
        });
    } catch (error) {
        console.log(error)
    }
}

exports.getAdd = async(req, res, next) => {
    const categories = await CategoryModel.all()
    res.render('admin/fields/add', {
        layout: 'layoutadmin.hbs',
        categories: categories
    });
}

exports.postAdd = async(req, res, next) => {
    const ret = await FieldModel.add(req.body);
    res.render('admin/fields/add', {
        layout: 'layoutadmin.hbs',
    });
}

exports.getUpdate = async(req, res, next) => {
    const field = await FieldModel.single(req.params.id)
    if (field === null) {
        return res.redirect('/admin/field')
    }

    const categories = await CategoryModel.except(field.categoryid)
    res.render('admin/fields/update', {
        layout: 'layoutadmin.hbs',
        field: field,
        categories: categories
    });
}

exports.postUpdate = async(req, res, next) => {
    const ret = await FieldModel.update(req.body);
    res.redirect('/admin/field')
}

exports.delete = async(req, res, next) => {
    const ret = await FieldModel.del(req.body);
    res.redirect('/admin/field')
}