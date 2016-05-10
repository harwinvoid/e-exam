var exam = require('../../app/controllers/exam.server.controller');
module.exports = function (app) {
    console.log('test');
    app.route('/addExam.json')
       .post(exam.addExam);
    
    app.route('/queryExam.json')
       .post(exam.queryExam);
       
    
};