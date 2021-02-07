const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
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
  phoneNumber: {
    type: Number,
    required: true,
  },
  skills: {
    type: Array,
    items: {
      type: String,
      //enum: ["value1","value2","value3"]
    },
    uniqueItems: true,
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
  description: {
    type: String,
  },
});

module.exports = mongoose.model("user", UserSchema);
