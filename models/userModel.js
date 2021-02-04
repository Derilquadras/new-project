const mongoose = require('mongoose')


const UserSchema = mongoose.Schema({

      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: true, 
        minLength: 6,
      },
      profilePicture: {
        type: String,
        required: true, 
        minLength: 6,

      },
      phoneNumber:{
          type:Number,
          required:true,
          min:10,
          max:10

      },
      skills:{
          type:[String]

      },

      role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
      },
      active: {
        type: Boolean,
        default: true,
        select: false,
      },
      description:{
          type:String
      }
    });


module.exports = mongoose.model('user', UserSchema);
    