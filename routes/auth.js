const {validationResult} = require("express-validator");
const authController = require("../controllers/client/auth.controller");

const express = require('express');
const {isNotAuth} = require("../middlewares/Authentication");
const {isAuth} = require("../middlewares/Authentication");
const {Validator} = require("../middlewares/Validator");

const router = express.Router();

router.get('/', isNotAuth, async function (req, res) {
  if (req.headers.referer) {
    req.session.retUrl = req.headers.referer;
  }

  res.render('auth/authentication', {
    layout: false
  });
})

router.post('/register', isNotAuth, Validator.register, async function (req, res) {
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

  await authController.register(req, res);
});

router.post('/login', isNotAuth, Validator.login, async function (req, res) {
  const result = validationResult(req);

  if (!result.isEmpty()) return res.render('auth/authentication', {
    layout: false,
    email: req.body.email,
    password: req.body.password,
    error: result.array({onlyFirstError: true})[0].msg
  });

  await authController.login(req, res);
});

router.post('/logout', isAuth, async function (req, res) {
  authController.logout(req, res);
});

router.route('/forgot')
  .get(isNotAuth, (req, res) => {

  })

module.exports = router;
