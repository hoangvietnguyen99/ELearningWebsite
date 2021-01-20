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
      },
      formatDate(date) {
        date = new Date(date);
        date = date.toISOString().split('T');
        return `${date[0]} at ${date[1].slice(0,8)}`
      }
    }
  }));
  app.set('view engine', 'hbs');
}
