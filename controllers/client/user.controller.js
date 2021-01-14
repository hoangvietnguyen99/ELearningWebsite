const userModel = require('../../models/user.model');
const multer = require('multer');

exports.getUserByID = async function(req, res) {
    const user = await userModel.getById(req.params.id);
    console.log(user.role);
    res.render('clients/profile', {
        layout: 'layoutclient.hbs',
        user: user,
        isTeacher: user.role === "TEACHER"
    })
}

exports.updateUser = async function(req, res) {
    const user = req.body;
    user.id = req.params.id;
    if (req.file)
        user.imgpath = `/assets/client/images/users/${req.file.originalname}`
    const result = await userModel.update(user);

    if (result !== null)
        res.redirect('/user/detail/' + req.params.id);
}

exports.getDetail = async function(req, res) {
    const user = await userModel.getById(req.params.id);
    res.render('clients/user_profile', {
        layout: 'layoutclient.hbs',
        user: user,
        isTeacher: user.role === "TEACHER"
    })
}