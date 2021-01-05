const express = require('express');
const router = express.Router();
const CourseModel = require('../../models/admin/CourseModel')

exports.index = async (req, res, next) => {
    try {
        const rows = await CourseModel.all()
        res.render('admin/courses/index', { 
          layout: 'layoutadmin.hbs',
          categories: rows,
          empty: rows.length === 0
        });
      } catch(error){
        console.log(error) 
      }
}

exports.getAdd = (req, res, next) => {
  res.render('admin/courses/add', { 
    layout: 'layoutadmin.hbs',
  });
}

exports.postAdd = async (req, res, next) => {
  const ret = await CategoryModel.add(req.body);
  res.render('admin/courses/add', { 
    layout: 'layoutadmin.hbs',
  });
}

exports.getUpdate = async (req, res, next) => {
  var category = await CategoryModel.single(req.params.id)
  if(category === null )
  {
    return res.redirect('/admin/course')
  }

  res.render('admin/courses/update', { 
    layout: 'layoutadmin.hbs',
    category: category
  });
}

exports.postUpdate = async (req, res, next) => {
  const ret = await CategoryModel.update(req.body);
  res.redirect('/admin/course')
}

exports.delete = async (req, res, next) => {
  const ret = await CategoryModel.del(req.body);
  res.redirect('/admin/course')
}



