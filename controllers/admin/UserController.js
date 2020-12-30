const express = require('express');
const UserModel = require('../../models/admin/UserModel')
const RoleModel = require('../../models/admin/RoleModel')
const AccountModel = require('../../models/admin/AccountModel')

exports.index = async (req, res, next) => {
    try {
        const rows = await UserModel.all()
        res.render('admin/users/index', { 
          layout: 'layoutadmin.hbs',
          users: rows,
          empty: rows.length === 0
        });
      } catch(error){
        console.log(error) 
      }
}

exports.getAdd = async (req, res, next) => {
  try {
      const roles = await RoleModel.all()
      res.render('admin/users/add', { 
        layout: 'layoutadmin.hbs',
        roles: roles
      });
    } catch(error){
      console.log(error) 
    }
}

exports.postAdd = async (req, res, next) => {
  var data = {}
  data.username = req.body.username
  //hash password in here
  data.hash =req.body.password
  data.salt = req.body.password
  if(req.body.password == req.body.repassword)
  {
    const account = await AccountModel.add(data);
  }
  res.render('admin/users/add', { 
    layout: 'layoutadmin.hbs',
  });

}