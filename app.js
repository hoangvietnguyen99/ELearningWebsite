<<<<<<< HEAD
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser')
=======
const createError = require('http-errors');
const express = require('express');
const port = 8000;
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs  = require('express-handlebars');

const pageRouter = require('./routes/pages')
const adminRouter = require('./routes/admin')
>>>>>>> parent of d616815... add 400 500 page

const app = express();

// view engine setup
<<<<<<< HEAD
require('./middlewares/view')(app);
// end view set up

// parse application/json
app.use(bodyParser.json())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
=======
const hbs = exphbs.create({
    extname: 'hbs',
});
app.set('views', path.join(__dirname, 'views'));
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
>>>>>>> parent of d616815... add 400 500 page
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//router
<<<<<<< HEAD
require('./middlewares/route')(app);

require('./middlewares/error')(app);
=======
app.use('/', pageRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});
>>>>>>> parent of d616815... add 400 500 page

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
