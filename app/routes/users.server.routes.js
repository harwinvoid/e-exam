var users = require('../../app/controllers/users.server.controller'),
    upload = require('../../app/controllers/file.server.controller'),
    passport = require('passport');

module.exports = function(app){
    app.route('/signup')
       .get(users.renderSignUp)
       .post(users.signup);
       
    app.route('/signin')
       .get(users.renderSignIn)
       .post(passport.authenticate('local',{
           successRedirect: '/',
           failureRedirect: '/signin',
           failureFlash: true
       }));
    app.route('/importStu')
        .post(upload.fileUpload);

    app.route('/queryTeacher.json')
        .post(users.queryTeacher)
       
    app.get('/signout',users.signout);
  /*app.route('/users')
     .post(users.create)
     .get(users.list);   
  app.route('/users/:userId')
     .get(users.read)
     .put(users.update)
     .delete(users.delete);
     
  app.param('userId',users.userById);*/
    
  
};