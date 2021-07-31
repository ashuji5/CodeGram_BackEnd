const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  answer: {
    type: String,
  },

  user : {
      type : String
  },

  createdAt: {
    type: Date,
    default: new Date(),
},
 
});

var answers = mongoose.model("answer", answerSchema);

module.exports = {answers};