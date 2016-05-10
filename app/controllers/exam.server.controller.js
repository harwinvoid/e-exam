var timeUtil = require('../../app/util/timeUtil'),
    moment = require('moment'),
    Exam = require('mongoose').model('Exam'),
    User = require('mongoose').model('User'),
    Room = require('mongoose').model('Room');
exports.addExam = function (req, res, next) {
    var teacherId = req.body.examTeacher,
        RoomId = req.body.examAddress,
        time = {
            startTime: moment.parseZone(req.body.startTime).utc().format(),
            endTime: moment.parseZone(req.body.endTime).utc().format()
        };
    var exam = new Exam(req.body);
    var currentUser = null, currentRoom = null;
    User.findUserById(teacherId, function (err, user) {
        if (err) {
            res.json({
                code: 0,
                msg: '该教师不存在'
            });
        } else {
            currentUser = user;
            console.log(currentUser)
            var TeacherAllExam = user.attendExam;
            if (TeacherAllExam.length === 0) {
                currentUser.attendExam.push(exam._id);
            } else if (TeacherAllExam.length > 0) {
                if (timeUtil.isAvaiable(TeacherAllExam, time)) {
                    currentUser.attendExam.push(exam._id);
                } else {
                    res.json({
                        code: 0,
                        msg: '该时间段【' + user.name + '】已经被分配监考任务'
                    });
                }
            }
            Room.findRoomById(RoomId, function (err, room) {
                if (err) {
                    res.json({
                        code: 0,
                        msg: '该考场不存在'
                    });
                } else {
                    if (room.capacity < req.body.capacity) {
                        res.json({
                            code: 0,
                            msg: '该考场座位不够，请重新选择'
                        });
                    } else {
                        var RoomAllExam = room.attendExam;
                        if (RoomAllExam.length === 0) {
                            currentRoom.attendExam.push(exam._id);
                        } else if (RoomAllExam.length > 0) {
                            if (timeUtil.isAvaiable(RoomAllExam, time)) {
                                currentRoom.attendExam.push(exam._id);
                            } else {
                                res.json({
                                    code: 0,
                                    msg: '该时间段【' + room.address + '】已经被分配考试'
                                });
                            }
                        }
                        currentRoom.save(function (err) {
                            console.log(err);
                        });
                        currentUser.save(function (err) {
                            console.log(err);
                        });
                        exam.save(function (err) {
                            if (err) {
                                res.json(err);
                            } else {
                                res.json({
                                    code: 1,
                                    msg: "添加考试成功"
                                });
                            }
                        });

                    }
                }
            });
        }
    });
};
exports.queryExam = function (req, res, next) {
    var limit = req.body.pageSize,
        name = req.body.name,
        offset = (req.body.pageNumber - 1) * limit;
    Exam.queryByPagination(name, offset, limit, function (err, datas) {
        if (err) {
            res.json(err);
        } else {
            Exam.findAll(name, function (err, data) {
                var result = {
                    data: datas,
                    total: data.length
                }
                res.json(result);
            })

        }
    });
};