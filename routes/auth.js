const express = require('express');
const database = require("../utils/database");
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

router.post('/', async function (req, res) {
  console.log(req.body);
  const isRegister = req.body.isRegister;

  if (isRegister === 'on') {
    const connection = database.createConnection();
    connection.beginTransaction(err => {
      if (err) throw err;
      // const
    });

    res.render('auth/authentication', {
      layout: false,
      isRegister: req.body.isRegister,
      email: req.body.email,
      password: req.body.password,
      confirm: req.body.confirm
    });
  } else {
    res.render('auth/authentication', {
      layout: false,
      email: req.body.email,
      password: req.body.password,
    });
  }

  //
  // return;
  // const user = await userModel.singleByUserName(req.body.username);
  // if (user === null) {
  //   return res.render('auth/authentication', {
  //     layout: false,
  //     err_message: 'Invalid username or password.'
  //   });
  // }
  //
  // const ret = bcrypt.compareSync(req.body.password, user.password);
  // if (ret === false) {
  //   return res.render('auth/authentication', {
  //     layout: false,
  //     err_message: 'Invalid username or password.'
  //   });
  // }
  //
  // req.session.isAuth = true;
  // req.session.authUser = user;
  // // req.session.cart = [];
  //
  // let url = req.session.retUrl || '/';
  // res.redirect(url);
});

// router.post('/logout', async function (req, res) {
//   req.session.isAuth = false;
//   req.session.authUser = null;
//   req.session.cart = [];
//   res.redirect(req.headers.referer);
// })

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
