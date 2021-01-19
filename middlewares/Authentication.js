module.exports =
	{
		isAuth(req, res, next) {
			if (req.session.isAuth === false) {
				req.session.retUrl = req.originalUrl;
				return res.redirect('/auth');
			}
			next();
		},
		isNotAuth(req, res, next) {
			if (req.session.isAuth === true) {
				return res.redirect(req.headers.referer || '/');
			}
			next();
		},
		isTeacher(req, res, next) {
			if (req.session.authUser.role !== 'TEACHER') {
				return res.redirect('/');
			}
			next();
		},
		isAdmin(req, res, next) {
			if (req.session.authUser.role !== 'ADMIN') {
				return res.redirect('/');
			}
			next();
		}
	}
