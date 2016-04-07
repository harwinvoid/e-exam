/**
 * Created by Harwin on 2016/4/7.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var ExamSchema = new Schema({
    startTime: {
        type:Date,
        required:'开始时间必须'
    },
    endTime: {
        type:Date,
        required:"结束时间必须"
    },
    teacher:[ObjectId],
    course:{
        courseId:String,
        courseName:String
    },
    clazz:{
        name:String,
        no:String,
        amount:Number
    },
    room:ObjectId



});
mongoose.model('Exam',ExamSchema,'exams');
