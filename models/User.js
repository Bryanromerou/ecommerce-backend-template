const mongoose = require("mongoose");
const { Schema, model } = require('mongoose');

const roles = ["ADMIN","CONSUMER"]

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  role: { 
    type: String, 
    default: roles[1], 
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  register_date: {
    type: Date,
    default: Date.now
  },
  cart: [{
    type:mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],
  created_products :[{
    type:mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }]
});

UserSchema.set("toJSON", {
  transform: (doc, ret, opt) => {
    delete ret["password"];
    return ret;
  },
});

const User = model('User', UserSchema);

module.exports = User;