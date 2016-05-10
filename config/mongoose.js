var config = require('./config'),
    mongoose = require('mongoose');
module.exports = function(){
    var db = mongoose.connect(config.db); 
    require('../app/models/user.server.model');
    require('../app/models/room.server.model');
    require('../app/models/exam.server.model');
    return db;
}