/**
 * Created by Harwin on 2016/4/7.
 */
var mongoose = require('mongoose'),
    Schema =mongoose.Schema;
var RoomSchema = new Schema({
    address:{
        type:String,
        required:"address is required"
    },
    roomNo:{
        type:String,
        required:"roomNo  is required"
    },
    capacity:{
        type:Number,
        required:'capacity is required'
    },
    created:{
        type:Date,
        default: Date.now
    }
});
mongoose.model('Room', RoomSchema, 'rooms');