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
    comment :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Comment",
        }
    ]
})

var PostMessage = mongoose.model('post', postSchema);

module.exports = {PostMessage};