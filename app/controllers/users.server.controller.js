var User = require('mongoose').model('User'),
    passport = require('passport');

var getErrorMessage = function (err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Somtthing went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }
    }
    return message;
}

exports.renderSignIn = function (req, res, next) {
    if (!req.user) {
        res.render('pages/signin', {
            title: 'Sign-in Form',
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/');
    }
};

exports.renderSignUp = function (req, res, next) {
    if (!req.user) {
        res.render('pages/signup', {
            title: 'Sign-up Form',
            messages: req.flash('error')

        });
    } else {
        return res.redirect('/');
    }
}
/**
 * 查询教师
 * */
exports.queryTeacher = function (req, res, next) {
    var limit = req.body.pageSize,
        name = req.body.name,
        offset = (req.body.pageNumber - 1) * limit;
    User.findAllTeacherByPagination(name, offset, limit, function (err, datas) {
        if (err) {
            console.log(err);
            return
        } else {
            User.findAllTeacher(name, function (err, data) {
                var result = {
                    data: datas,
                    total: data.length
                }
                res.json(result);
            })

        }
    });

};
/**
 * 删除教师
 * */
exports.delTeacher = function (req, res, next) {
    var delIds = req.body.ids;
    User.delTeacherById(delIds, function (err,data) {
        res.json(data);

    });
}
exports.queryUserInfo = function(req,res,next){
    var id = req.body.id,
        role = req.body.role;
    console.log(id,role);
    User.queryUserInfo(id,role,function(err,data){
        if(err) return err;
        res.json(data);
    });
}
exports.signup = function (req, res, next) {
    if (!req.user) {
        var user = new User(req.body);
        console.log(user);
        var message = null;
        console.log(req.body);
        user.provider = 'local';
        user.save(function (err) {
            if (err) {
                message = getErrorMessage(err);
                req.flash('error', message);
                console.log(err);
                return res.redirect('/signup');
            }
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });


        });
    } else {
        return res.redirect('/');
    }
};
exports.signout = function (req, res) {
    req.logout();
    res.redirect('/');

}


exports.saveOAuthUserProfile = function (req, profile, done) {
    User.findOne({
        provider: profile.provider,
        providerId: profile.providerId
    }, function (err, user) {
        if (err) {
            return done(err);
        } else {
            if (!user) {
                var possibleUsername = profile.username ||
                (profile.email) ? profile.email.split('@')[0] : '';

                User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
                    profile.username = availableUsername;

                    user = new User(profile);

                    user.save(function (err) {
                        if (err) {
                            var message = _this.getErrorMessage(err);

                            req.flash('error', message);
                            return res.redirect('/signup');
                        }
                        return done(err, user);
                    });
                });
            } else {
                return done(err, user);
            }
        }
    });
}
exports.updateUserInfo = function(req,res,next){
    console.log('-------');
    console.log(req.body);
    var user= {
        _id: req.body._id,
        uno: req.body.uno,
        name: req.body.name,
        major: req.body.major,
        phone: req.body.phone,
        address: req.body.address
    };
    User.updateUserInfo(user._id,user,function(err,data){
       if(err){
           res.json(err)
       }else{
           res.json(data);
       }
    });
}


/*exports.create = function(req,res,next){
 var user = new User(req.body);
 console.log(req.body);
 user.save(function(err){
 if(err){
 return next(err);
 } else{
 res.json(user);
 }
 });
 };
 exports.list = function(req,res,next){
 User.find({},function(err,users){
 if(err){
 return next(err);
 }else{
 console.log(users);
 res.json(users);
 }
 });
 };
 exports.read = function(req,res){
 res.json(req.user);
 }
 exports.userById = function(req,res,next,id){
 User.findOne({_id:id},function(err,user){
 if(err){
 return next(err);
 } else{
 req.user = user;
 next();
 }
 });

 };
 exports.update = function(req,res,next){
 User.findByIdAndUpdate(req.user.id,req.body,function(err,user){
 if(err){
 return next(err);
 }else{
 res.json(user);
 }
 })
 };
 exports.delete = function(req,res,next){
 req.user.remove(function(err){
 if(err){
 return next(err);
 } else{
 res.json(req.user);
 }
 });
 };*/