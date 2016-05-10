/**
 * Created by Harwin on 2016/4/7.
 */
var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;
var ExamSchema = new Schema({
    time: {
        startTime: {
            type: Date,
            required: "开始时间必须"
        },
        endTime: {
            type: Date,
            required: "结束时间必须"
        }
    },
    examTeacher: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    courseName: String,
    attendNum: Number,
    attendClass: String,
    examAddress: {
        type: Schema.Types.ObjectId,
        ref: 'Room'

    },
    examType: {
        type: String,
        enum: ["上机考试", "笔试"]
    }
});

ExamSchema.statics.queryByPagination = function (name, offset, pageSize, cb) {
    if (name) {
        return this.find({ courseName: { $regex: name } }).skip(offset).limit(pageSize).exec(cb);
    } else {
        return this.find({})
            .skip(offset)
            .limit(pageSize)
            .populate('examAddress examTeacher')
            .exec(cb);
    }

};
ExamSchema.statics.findAll = function (no, cb) {
    if (no) {
        return this.find({ courseName: { $regex: no } }).exec(cb);
    } else {
        return this.find({}).exec(cb);
    }

}
ExamSchema.set('toJson', {
    getters: true,
    setters: true
});
mongoose.model('Exam', ExamSchema, 'exams');
