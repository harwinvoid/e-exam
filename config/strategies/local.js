var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

module.exports = function () {
    passport.use('local',new LocalStrategy({
      usernameField :"stno",
      passwordField :"pwd",
    },function (username, password, done) {
        User.findOne({
            stno: username
        }, function (err, user) {
            console.log('success');
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Unknow user'
                });
            }
            if (!user.authenticate(password)) {
                return done(null, false, {
                    message: 'Invalid password'
                });
            }
            return done(null,user);
        });
    }));
};