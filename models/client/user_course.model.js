const db = require('../../utils/database');

module.exports = {
    all(){
        return db.load('SELECT * FROM user_course');
    }
}