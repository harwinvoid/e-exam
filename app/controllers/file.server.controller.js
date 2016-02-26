var multiparty = require('multiparty'),
    User = User = require('mongoose').model('User'),
    xlsx = require('node-xlsx'),
    fs = require('fs');
exports.fileUpload = function (req, res) {
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
                        var stuInfo = infoJson[i];
                        var user = {};
                        for (var j = 0; j < stuInfo.length; j++) {
                            //根据解析出来的数据构造用户
                            user = new User({
                                name: stuInfo[0],
                                stno: stuInfo[1],
                                sid: stuInfo[2],
                                role: stuInfo[3],
                                major: stuInfo[4]
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
}