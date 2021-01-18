const { isTeacher, isAuth, isAdmin } = require('./Authentication');

module.exports = function(app) {
    // app.get('/', function (req, res) {
    //   // res.send('Hello World!');
    //   // console.log(res.locals.lcCategories);
    //   res.render('home');
    // });

    // app.get('/about', function (req, res) {
    //   throw new Error('ABOUT BROKEN');
    //   res.render('about');
    // });

    // app.get('/bs4', function (req, res) {
    //   // res.sendFile(`${__dirname}/bs4.html`);

    //   const show = +req.query.show || 0;
    //   const visible = show !== 0;

    //   res.render('bs4', {
    //     layout: false,
    //     data: { visible: visible }
    //   });
    // });
    app.use('/', require('../routes/pages'));

    app.use('/admin', isAuth, isAdmin, require('../routes/admin'));
    // app.use('/admin/products', require('../routes/product.route'));
    app.use('/teacher', isAuth, isTeacher, require('../routes/teacher'));
    app.use('/auth', require('../routes/auth'));
    app.use('/courses', require('../routes/courses'));
    app.use('/cart', isAuth, require('../routes/cart'));
    app.use('/users', isAuth, require('../routes/users'));

    app.use('/fields', require('../routes/fields'));

    app.use('/confirm', require('../routes/confirm'));
    // app.use('/products', require('../routes/front/product.route'));
    // app.use('/cart', auth, require('../routes/front/cart.route'));

    // app.use('/demo', require('../routes/demo.route'));
}
