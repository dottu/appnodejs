const express = require('express');
const mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user : 'root',
    password: '',
    database: 'appweb'
});

//connection data base 
connection.connect(function(err){
    if(err) throw err;
    console.log("thanh cong")
});

module.exports = connection;