process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var mongoose = require('./config/mongoose'),
    express =require('./config/express'),
    passport = require('./config/passport');

var db = mongoose();
var app = express();
var  Passport = passport();
module.exports = app;
console.log('Server is running on localhost:3000/');
