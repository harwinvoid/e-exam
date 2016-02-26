var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;
    
var UserSchema = new Schema({
    name: {
        type: String
    },
    password:{
      type:String
    },
    sid:{
        type:String,
        trim: true,
        unique: true,
        required:'stno is required'
    },
    stno:{
        type:String,
        required: 'Username is required'
    },

    role:{
        type:Number,
        default:2
    },
    major:{
        type:String,
    },
    salt: {
        type: String
    },
    provider: {
      type: String,
      required: 'Provider is required'  
    },
    providerId: String,
    providerData:{},
    created: {
        type: Date,
        default: Date.now
    }
});
UserSchema.pre('save',function(next){
    this.password = this.sid.substring(this.sid.length-6,this.sid.length);
   if(this.password){
       this.salt = new Buffer(crypto.randomBytes(16).toString('base64'),'base64');
       this.password = this.hashPassword(this.password);
   } 
   next();
});

UserSchema.methods.hashPassword = function(password){
    return crypto.pbkdf2Sync(password,this.salt,10000,64).toString('base64');
    
};

UserSchema.methods.authenticate = function(password){
  console.log(password)
  return this.password === this.hashPassword(password);  
};

UserSchema.statics.findUniqueUsername = function(username,suffix,callback){
  var _this = this;
  var possibleUsername = username + (suffix || '');
  
  _this.findOne({
    username:possibleUsername  
  },function(err,user){
      if(err){
          if(!user){
              callback(possibleUsername);
          }else{
              return _this.findUniqueUsername(username,(suffix || 0) + 1,callback);
          }
      }else{
          callback(null);
      }
  });
};

UserSchema.set('toJson',{
   getters: true,
   setters: true 
});
mongoose.model('User',UserSchema,'users');

