var room = require('../../app/controllers/room.server.controller'),
    upload = require('../../app/controllers/file.server.controller');
module.exports = function (app) {
    app.route('/queryroom.json')
       .post(room.queryRoom);

}
