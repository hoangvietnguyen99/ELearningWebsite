module.exports =
{
  isAuth: (req, res, next) => {
    if (req.session.isAuth === false) {
      req.session.retUrl = req.originalUrl;
      return res.redirect('/auth');
    }
    next();
  },
  isNotAuth: (req, res, next) => {
    if (req.session.isAuth === true) {
      return res.redirect(req.headers.referer || '/');
    }
    next();
  },
  isTeacher: (req, res, next) => {
    return this.isAuth(req, res, function () {
      if (req.authUser.role !== 'TEACHER') {
        req.session.retUrl = req.originalUrl;
        return res.redirect(req.session.retUrl || '/');
      }
      next();
    });
  },
  isAdmin: (req, res, next) => {
    return this.isAuth(req, res, function () {
      if (req.authUser.role !== 'ADMIN') {
        req.session.retUrl = req.originalUrl;
        return res.redirect(req.session.retUrl || '/');
      }
      next();
    });
  }
}
