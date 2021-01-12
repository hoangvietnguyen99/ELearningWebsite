const multer = require('multer');
const courseModel = require('../../models/course.model');
const fieldModel = require('../../models/field.model');
const field_courseModel = require('../../models/field_course.model');

exports.getCourses  = async function(req,res,next ){
    const user = req.session.authUser;
    const courses = await courseModel.allByAuthor(user.id);
    const fields  = await fieldModel.getAll();
    await Promise.all(courses.map(async course => {
      let fieldIds = await field_courseModel.getListFieldIDByCourseID(course.id);
	    course.fieldIds = fieldIds.map(field => field.fieldid);
      return course;
    }));
    res.render('clients/listCourses', {
        layout: 'layoutclient.hbs',
        courses : courses,
        fields: fields,
        empty: courses.length == 0
    });
};

exports.addImage =  function(req,res,next ){
    const storage = multer.diskStorage({
		destination: function (req, file, cb) {
		  cb(null, './public/assets/client/images/courses')
		},
		filename: function (req, file, cb) {
		  cb(null, req.params.id + `.png`)
		}
	  });
	  const upload = multer({ storage });
	  // upload.single('fuMain')(req, res, function (err) {
	  upload.array('fuMain',1)(req, res, function (err) {
		if (err) {
			console.log('Error load');
		} else {
			res.redirect('/teacher/courses');
		}
	  });
};

exports.addCourse =  async function(req,res,next){
    const author = req.session.authUser.id;
    const {name,number,price,Des,selection} = req.body;
    const course = {
        name: name,
        author: author,
        lessonscount: number,
        price: price,
        description: Des
    }
    console.log(selection);
    const result = await courseModel.addOne(course);
    for(let i = 0 ;i< selection.length;i++){
      const resu = await field_courseModel.addOne(selection[i],result.id);
    }
    if(result !== null)
    res.redirect('/teacher/courses');
};

exports.deleteCourse = async function(req,res){
  console.log(req.params.id);
  const field = await field_courseModel.removeByCourseID(req.params.id);
  const result = await courseModel.remove([{id: req.params.id}, {statuscode: 'UNAVAILABLE'}]);
  if(result !== null)
  //res.json({status: true, url: "/teacher/courses"});
  return res.redirect('/teacher/courses');
  //res.send('OK');
};

exports.updateCourse = async function(req,res,next){

  const author = req.session.authUser.id;
  const {name,number,price,Des} = req.body;
  const course = {
      id: req.params.id,
      name: name,
      author: author,
      lessonscount: number,
      price: price,
      description: Des
  }
 //const field_course = field_courseModel.getListFieldByCourseID(req.params.id)
  // for(let i = 0 ;i< selection.length;i++){
  //   const resu = await field_courseModel.updateOne(selection[i],result.id);
  // }
  // const result = await courseModel.update(course);
  // if(result !== null)
  res.redirect('/teacher/courses/');
}
