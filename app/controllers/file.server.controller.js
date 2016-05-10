var multiparty = require('multiparty'),
    User = require('mongoose').model('User'),
    Room = require('mongoose').model('Room'),
    xlsx = require('node-xlsx'),
    fs = require('fs');
exports.userFileUpload = function (req, res) {
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({
        uploadDir: 'public/uploadDir'
    });
    //上传完成后处理
    form.parse(req, function (err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        if (err) {
            console.log('parse error: ' + err);
        } else {
            // console.log('parse files: ' + filesTmp);
            var inputFile = files.upfile[0];
            var uploadedPath = inputFile.path;
            var dstPath = 'public/uploadDir/' + inputFile.originalFilename;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                    //解析上传的excel文件
                    var obj = xlsx.parse(dstPath);
                    var infoJson = obj[0].data;
                    for (var i = 1; i < infoJson.length; i++) {
                        var userInfo = infoJson[i];
                        var user = {};
                        for (var j = 0; j < userInfo.length; j++) {
                            //根据解析出来的数据构造用户
                            user = new User({
                                name: userInfo[0],
                                uno: userInfo[1],
                                uid: userInfo[2],
                                role: userInfo[3],
                                major: userInfo[4],
                                address: userInfo[5],
                                phone: userInfo[6]

                            });
                            user.provider = 'local';
                        }
                        //将用户保存到数据库
                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                            }
                        })

                    }
                }
            });
            success(files);

        }
    });
    var success = function (files) {
        res.json({
            state: 2,
            name: files
        });
    };
};
exports.roomFileUpload = function (req, res) {
    var form = new multiparty.Form({
        uploadDir: 'public/uploadDir'
    });
    form.parse(req, function (err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        if (err) {
            console.log('parse error: ' + err);
        } else {
            // console.log('parse files: ' + filesTmp);
            var inputFile = files.upfile[0];
            var uploadedPath = inputFile.path;
            var dstPath = 'public/uploadDir/' + inputFile.originalFilename;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                    //解析上传的excel文件
                    var obj = xlsx.parse(dstPath);
                    var infoJson = obj[0].data;
                    for (var i = 1; i < infoJson.length; i++) {
                        var roomInfo = infoJson[i];
                        var room = {};
                        for (var j = 0; j < roomInfo.length; j++) {
                            var isEmpty = roomInfo[3] == "是" ? true : false;
                            //根据解析出来的数据构造用户
                            room = new Room({
                                roomNo: roomInfo[0],
                                address: roomInfo[1],
                                capacity: roomInfo[2],
                                isEmpty: isEmpty
                            });
                        }
                        //将用户保存到数据库
                        room.save(function (err) {
                            if (err) {
                                return error;
                            }
                        });

                    }
                }
            });
            success(files);

        }
    });
    var success = function (files) {
        res.json({
            state: 2,
            name: files
        });
    };

}