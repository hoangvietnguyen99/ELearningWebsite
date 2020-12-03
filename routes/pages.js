const express = require('express');
const router = express.Router();

//Index
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

//User
router.get('/user', function(req, res, next) {
    res.send('respond with a resource');
});
  
module.exports = router;