const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  code: Number,
  name: String,
  price: Number,
});

module.exports = mongoose.model("Menu", menuSchema);