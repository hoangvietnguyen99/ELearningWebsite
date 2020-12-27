const express = require('express');
const router = express.Router();

//Index
router.get('/', function(req, res, next) {
    res.render('admin/index', { layout: 'layoutadmin.hbs' });
  });

module.exports = router;