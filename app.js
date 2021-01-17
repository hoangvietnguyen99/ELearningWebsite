const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const bodyParser = require('body-parser')
const methodOverride = require('method-override');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
require('./middlewares/View')(app);
// end view set up

// parse application/json
app.use(bodyParser.json())

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
require('./middlewares/Session')(app);

require('./middlewares/Local')(app);

//router
require('./middlewares/Routes')(app);

require('./middlewares/ErrorHandler')(app);



module.exports = app;

// app.listen(port, () => {
// 	console.log(`Example app listening at http://localhost:${port}`)
// })
