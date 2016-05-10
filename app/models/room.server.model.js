/**
 * Created by Harwin on 2016/4/7.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var RoomSchema = new Schema({
    address: {
        type: String,
        required: "address is required"
    },
    roomNo: {
        type: String,
        required: "roomNo  is required"
    },
    capacity: {
        type: Number,
        required: 'capacity is required'
    },
    /**
     * 是否被占用
     */
    isEmpty: {
        type: Boolean,
        default: false,
        required: 'isEmpty is required'
    },
    attendExam:[
        {
               type: Schema.Types.ObjectId,
               ref: 'Exam'           
        }
    ]
});
RoomSchema.statics.findRoomById = function (id,cb) {
    if(id){
        return this.findOne({_id:id})
                   .populate('attendExam')
                   .exec(cb);
    }
    
};
RoomSchema.statics.findAllRoomByPagination = function (no, offset, pageSize, cb) {
    if (no) {
        console.log(no);
        return this.find({ roomNo: { $regex: no } }).skip(offset).limit(pageSize).exec(cb);
    } else {
        return this.find({}).skip(offset).limit(pageSize).exec(cb);
    }
}

RoomSchema.statics.findAllRoom = function (no, cb) {
    if (no) {
        console.log(no);
        return this.find({ roomNo: { $regex: no } }).exec(cb);
    } else {
        return this.find({}).exec(cb);
    }

}
RoomSchema.statics.delRoomById = function (ids, cb) {
    return this.remove({ _id: { $in: ids }},cb);

}
RoomSchema.set('toJson', {
    getters: true,
    setters: true
});
mongoose.model('Room', RoomSchema, 'rooms');