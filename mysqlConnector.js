// Load module
var mysql = require('mysql');
// Initialize pool
var pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "",
    password: "",
    database: ""
});

module.exports = pool;