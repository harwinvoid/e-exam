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
exports.addRoom = function (req, res, next) {
    var no = req.body.no,
        address = req.body.address,
        capacity = req.body.capacity,
        isEmpty = req.body.isEmpty;
    var room = new Room({
        roomNo: no,
        address: address,
        capacity: capacity,
        isEmpty: isEmpty
    });
    room.save(function (err) {
        if (err) {
            res.json(err);
        } else {
            res.json('success');
        }
    });
};
exports.delRoom = function (req, res, next) {
    var delIds = req.body.ids;
    console.log(delIds);
    Room.delRoomById(delIds, function (err, data) {
        if (err) {
            res.json(data);
        } else {
            res.json(data);
        }


    });

}