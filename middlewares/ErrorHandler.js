const createError = require('http-errors');

module.exports = function (app) {
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    if (err.status === 403) res.render('403', {
      layout: false
    });
    else if (err.status === 404) res.render('404', {
      layout: false
    });
    else res.render('500', {
      layout: false, err
    });
  });
}