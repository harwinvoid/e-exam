var room = require('../../app/controllers/room.server.controller'),
    upload = require('../../app/controllers/file.server.controller');
module.exports = function (app) {
    app.route('/queryroom.json')
       .post(room.queryRoom);
       
    app.route('/addRoom.json')
       .post(room.addRoom);
       
    app.route('/uploadRoom.json')
       .post(upload.roomFileUpload);
    
    app.route('/delRoom.json')
       .post(room.delRoom); 

}
