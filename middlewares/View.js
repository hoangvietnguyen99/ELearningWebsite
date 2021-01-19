const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const numeral = require('numeral');

module.exports = function (app) {
  app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    layoutsDir: 'views/layouts',
    partialsDir: 'views/partials',
    helpers: {
      section: hbs_sections(),
      format(val) {
        return numeral(val).format('0,0');
      },
      isTeacher(role) {
        return role === 'TEACHER'
      },
      isAdmin(role) {
        return role === 'ADMIN'
      }
    }
  }));
  app.set('view engine', 'hbs');
}
