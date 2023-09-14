const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '192.168.100.66',
    user: 'root',
    password: 'a.123456',
    database: 'gastro_db',
    port: '23306'
});

db.connect(function(err) {
    if (err) throw err;
    console.log('DATABASE CONNECTED!');
});

module.exports = db;