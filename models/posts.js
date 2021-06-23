const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    message: String,
    creator: String,
    selectedFile: String,
    likeCount: {
        type: Number,
        default: 0,
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