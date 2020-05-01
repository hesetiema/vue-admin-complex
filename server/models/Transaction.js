const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  title: { type: String },
  author: { type: String },
  importance: { type: Number },
  comment: { type: String },
  state: { type: String },
});
//mongoose.model(modelName, schema)
module.exports = mongoose.model("Transaction", schema);
