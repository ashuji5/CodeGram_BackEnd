const mongoose = require("mongoose");

const doubtSchema = new mongoose.Schema({
  Qestion: {
    type: String,
  },
  Answer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "answer",
  },

  createdAt: {
    type: Date,
    default: new Date(),
},
});

var doubt = mongoose.model("doubt", doubtSchema);

module.exports = {doubt};