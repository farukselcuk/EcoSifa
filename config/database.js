const mysql = require('mysql2');
const config = require('./config');

const connection = mysql.createConnection({
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password
});

connection.connect((err) => {
    if (err) {
        console.error('Veritabanına bağlanırken hata oluştu:', err);
        return;
    }
    console.log('MySQL veritabanına başarıyla bağlandı');
});

module.exports = connection; 