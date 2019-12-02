var mongoose = require('mongoose');

var options = {promiseLibrary: require('bluebird'), useNewUrlParser: true};
require('dotenv').config()

//mLab credentials
// var mongodbUri = process.env.DATABASEURL;
// console.log(process.env.DATABASEURL);

 var mongodbUri = 'mongodb://localhost:27017/robo';

mongoose.connect(mongodbUri, options);
var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));
