const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser')

const app = express();

// view engine setup
require('./middlewares/view')(app);
// end view set up

// parse application/json
app.use(bodyParser.json())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//router
require('./middlewares/route')(app);

require('./middlewares/error')(app);

module.exports = app;

// app.listen(port, () => {
// 	console.log(`Example app listening at http://localhost:${port}`)
// })
