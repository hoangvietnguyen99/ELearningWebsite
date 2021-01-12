const userModel = require('../../models/user.model');

exports.getUserByID = async function(req,res){
    const user = await userModel.getById(req.prams.id);
    console.log(user);
    res.render('clients/profile',{
        layout: 'layoutclient.hbs',
        user: user
    })
}