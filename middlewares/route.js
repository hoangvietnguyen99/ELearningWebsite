const auth = require('./auth');
const {Validator} = require("./validator");

module.exports = function (app) {
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

  // app.use('/admin/categories', require('../routes/category.route'));
  // app.use('/admin/products', require('../routes/product.route'));

  app.use('/auth', [...Validator], require('../routes/auth'));
  // app.use('/products', require('../routes/front/product.route'));
  // app.use('/cart', auth, require('../routes/front/cart.route'));

  // app.use('/demo', require('../routes/demo.route'));
}
