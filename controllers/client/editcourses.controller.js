const multer = require('multer');
const courseModel = require('../../models/course.model');
const fieldModel = require('../../models/field.model');
const field_courseModel = require('../../models/field_course.model');
const database = require('../../utils/database');

exports.getCourses = async function (req, res, next) {
	const user = req.session.authUser;
	const courses = await courseModel.allByAuthor(user.id);
	const fields = await fieldModel.getAll();
	await Promise.all(courses.map(async course => {
		course.fieldIds = await field_courseModel.getListFieldIDByCourseID(course.id)
		return course;
	}));
	res.render('clients/listCourses', {
		layout: 'layoutclient.hbs',
		courses: courses,
		fields: fields,
		empty: courses.length == 0
	});
};

exports.addImage = function (req, res, next) {
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, './public/assets/client/images/courses')
		},
		filename: function (req, file, cb) {
			cb(null, req.params.id + `.png`)
		}
	});
	const upload = multer({storage});
	// upload.single('fuMain')(req, res, function (err) {
	upload.array('fuMain', 1)(req, res, function (err) {
		if (err) {
			console.log('Error load');
		} else {
			res.redirect('/teacher/courses');
		}
	});
};

exports.addCourse = async function (req, res, next) {
	const author = req.session.authUser.id;
	const {name, number, price, Des, selection ,tinydes} = req.body;
	
	const course = {
		name: name,
		author: author,
		lessonscount: number,
		price: price,
		description: Des,
		tinydes: tinydes
	}
	const result = await courseModel.addOne(course);
	for (let i = 0; i < selection.length; i++) {
		const resu = await field_courseModel.addOne(selection[i], result.id);
	}
	if (result !== null)
		res.redirect('/teacher/courses');
};

exports.updateCourse = async function (req, res, next) {
	const thisCourse = await courseModel.getById(req.params.id);
	if (!thisCourse) return res.redirect(req.headers.referer || '/');
	if (thisCourse.author != req.session.authUser.id) return res.redirect(req.headers.referer || '/');
	const connection = await database.getConnection();
	connection.beginTransaction(async err => {
		if (err) throw err;
		try {
			const {name, number, price, Des, selection,tinydes} = req.body;
			const course = {
				id: req.params.id,
				name: name,
				lessonscount: number,
				price: price,
				description: Des,
				lastupdatedat: new Date(),
				tinydes: tinydes
			};
			const fieldIds = await field_courseModel.getListFieldIDByCourseID(course.id);
			const result = await Promise.all([
				courseModel.update(course, connection),
				fieldIds.length ? field_courseModel.removeByCourseID(course.id, connection) : 1,
				field_courseModel.addFieldIdsToCourseId(course.id, selection, connection)
			]);
			if (!result.includes(0)) {
				connection.commit(commitError => {
					connection.release();
					if (commitError) throw commitError;
					res.redirect(req.headers.referer || '/');
				});
			} else throw 'Can not save course';
		} catch (err) {
			console.log(err);
			connection.rollback(rollbackError => {
				connection.release();
				if (rollbackError) throw rollbackError;
				res.redirect(req.headers.referer || '/');
			});
		}
	});
}
