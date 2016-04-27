var Room = require('mongoose').model('Room');
/**
 * 查询所有教室
 * */
exports.queryRoom = function (req, res, next) {
    var limit = req.body.pageSize,
        name = req.body.name,
        offset = (req.body.pageNumber - 1) * limit;
    Room.findAllRoomByPagination(name, offset, limit, function (err, datas) {
        if (err) {
            res.json(err);
        } else {
            Room.findAllRoom(name, function (err, data) {
                var result = {
                    data: datas,
                    total: data.length
                }
                res.json(result);
            })

        }
    });

};