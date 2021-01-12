const userModel = require('../../models/user.model');

exports.getUserByID = async function(req,res){
    const user = await userModel.getById(req.params.id);
    console.log(user.role);
    res.render('clients/profile',{
        layout: 'layoutclient.hbs',
        user: user,
        isTeacher: user.role === "TEACHER"
    })
}