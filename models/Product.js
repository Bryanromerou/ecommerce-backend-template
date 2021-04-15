const mongoose = require("mongoose");
const { Schema, model } = require('mongoose');

// Create Schema
const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  upload_date: {
    type: Date,
    default: Date.now
  },
  sold_out:{
    type: Boolean,
    default: false
  },
  user_created: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
});



const Product = model('Product', ProductSchema);

module.exports = Product;