var mongoose = require('mongoose'),
    crypto = require('crypto'),
    async = require('async'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        /*用户姓名*/
        type: String
    },
    password: {
        /*用户密码*/
        type: String
    },
    uid: {
        /*用户身份证号码*/
        type: String,
        trim: true,
        unique: true,
        required: 'uid is required'
    },
    uno: {
        /*用户编号*/
        type: String,
        required: 'uno is required'
    },
    address: String, /*用户办公地址（如果有）*/
    phone: String, /*用户电话*/
    permission: {
        /*用户权限1.管理员，0.非管理员 */
        type: Number,
        default: 0,
    },
    role: Number, /*用户角色 2.教师 ，3.学生*/
    major: {
        /*专业*/
        type: String,
    },
    salt: {
        type: String
    },
    provider: {
        type: String,
        required: 'Provider is required'
    },
    providerId: String,
    providerData: {},
    created: {
        type: Date,
        default: Date.now
    }
});
UserSchema.pre('save', function (next) {
    this.password = this.uid.substring(this.uid.length - 6, this.uid.length);
    this.permission = this.role;
    if (this.password) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

UserSchema.methods.hashPassword = function (password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');

};

UserSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
};

UserSchema.statics.findAllTeacherByPagination = function (name, offset, pageSize, cb) {
    if (name) {
        console.log('name:' + name);
        return this.find({role: 2, name: {$regex: name}}).skip(offset).limit(pageSize).exec(cb);
    } else {
        return this.find({role: 2}).skip(offset).limit(pageSize).exec(cb);
    }

}

UserSchema.statics.findAllStudentByPagination = function (name, offset, pageSize, cb) {
    if (name) {
        var flag = parseInt(name);
        if(flag === NaN){
        return this.find({role: 3, name: {$regex: name}}).skip(offset).limit(pageSize).exec(cb);
        }else{
            return this.find({role: 3, uno: {$regex: name}}).skip(offset).limit(pageSize).exec(cb);
        }
    } else {
        return this.find({role: 3}).skip(offset).limit(pageSize).exec(cb);
    }

}

UserSchema.statics.findAllTeacher = function (name, cb) {
    if (name) {
        console.log('name:' + name);
        return this.find({role: 2, name: {$regex: name}}).exec(cb);
    } else {
        return this.find({role: 2}).exec(cb);
    }

}

UserSchema.statics.findAllStudent = function (name, cb) {
    if (name) {
        var flag = parseInt(name);
        if(flag === NaN){
            return this.find({role: 3, name: {$regex: name}}).exec(cb);    
        }else{
            return this.find({role: 3, uno: {$regex: name}}).exec(cb);
        }
        
    } else {
        return this.find({role: 3}).exec(cb);
    }

}

UserSchema.statics.delTeacherById = function (ids, cb) {
    this.remove({role:2, _id: {$in: ids}}, cb)
};

UserSchema.statics.delStudentById = function (ids, cb) {
    console.log(ids);
    this.remove({role:3, _id: {$in: ids}}, cb)
};


UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne({
        username: possibleUsername
    }, function (err, user) {
        if (err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};
//更新用户数据
UserSchema.statics.updateUserInfo = function(_id,user,cb){
  return this.update({_id: _id }, { $set: { uno:user.uno,name: user.name,major:user.major,phone:user.phone,address:user.address }},cb);
};
UserSchema.statics.queryUserInfo =function(id,role,cb){
    return this.findOne({_id:id,role:role}).exec(cb);
}
UserSchema.set('toJson', {
    getters: true,
    setters: true
});
mongoose.model('User', UserSchema, 'users');

