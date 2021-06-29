const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    message: String,
    name : String,
    creator: String,
    selectedFile: String,
    likes: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    comment :{
        type : String,
        default : 5
    }
})

var PostMessage = mongoose.model('post', postSchema);

module.exports = {PostMessage};