const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  answer: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: new Date(),
},
 
});

var answer = mongoose.model("answer", answerSchema);

module.exports = {answer};