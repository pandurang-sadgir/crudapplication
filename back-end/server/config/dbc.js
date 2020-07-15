var mysql = require('mysql');
connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'student'
});
connection.connect((req,res)=>{
    console.log('Database Connection is successfully');
});
module.exports = connection;