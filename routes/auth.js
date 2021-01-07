const {validationResult} = require("express-validator");
const AuthController = require("../controllers/client/Authentication.controller");

const express = require('express');
const database = require("../utils/database");
const {Validator} = require("../middlewares/Validator");
// const bcrypt = require('bcryptjs');
// const moment = require('moment');

// const userModel = require('../../models/user.model');
// const auth = require('../../middlewares/auth.mdw');

const router = express.Router();

router.get('/', async function (req, res) {
  if (req.headers.referer) {
    req.session.retUrl = req.headers.referer;
  }

  res.render('auth/authentication', {
    layout: false
  });
})

router.post('/register', Validator.register, async function (req, res) {
  const result = validationResult(req);

  if (!result.isEmpty()) return res.render('auth/authentication', {
    layout: false,
    isRegister: true,
    email: req.body.email,
    password: req.body.password,
    error: result.array({onlyFirstError: true})[0].msg
  });

  if (req.body.confirm !== req.body.password) return res.render('auth/authentication', {
    layout: false,
    isRegister: true,
    email: req.body.email,
    password: req.body.password,
    error: 'Password confirm not match'
  });

  await AuthController.register(req, res);
});

router.post('/login', Validator.login, async function (req, res) {
  const result = validationResult(req);

  if (!result.isEmpty()) return res.render('auth/authentication', {
    layout: false,
    email: req.body.email,
    password: req.body.password,
    error: result.array({onlyFirstError: true})[0].msg
  });

  await AuthController.login(req, res);
});

router.post('/logout', async function (req, res) {
  AuthController.logout(req, res);
});

router.post('/facebook', (req, res, next) => {

})

// router.get('/register', async function (req, res) {
//   res.render('vwAccount/register');
// })

// router.post('/register', async function (req, res) {
//   const hash = bcrypt.hashSync(req.body.password, 10);
//   const dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
//   const user = {
//     username: req.body.username,
//     password: hash,
//     dob: dob,
//     name: req.body.name,
//     email: req.body.email,
//     permission: 0
//   }

//   await userModel.add(user);
//   res.render('vwAccount/register');
// })

// router.get('/is-available', async function (req, res) {
//   const username = req.query.user;
//   const user = await userModel.singleByUserName(username);
//   if (user === null) {
//     return res.json(true);
//   }

//   res.json(false);
// })

// router.get('/profile', auth, async function (req, res) {
//   res.render('vwAccount/profile');
// })

module.exports = router;
