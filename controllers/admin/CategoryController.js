const express = require('express');
const router = express.Router();
const CategoryModel = require('../../models/admin/CategoryModel')

exports.index = async (req, res, next) => {
    try {
        const rows = await CategoryModel.all()
        res.render('admin/categories/index', { 
          layout: 'layoutadmin.hbs',
          categories: rows,
          empty: rows.length === 0
        });
      } catch(error){
        console.log(error) 
      }
}