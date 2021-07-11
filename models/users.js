const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },

    password  : {
        type : String,
        required : true
    },

    email : {
        type : String,
        reqired : true
    },

    profileImg : {
        type :String,
        default : ""
    },

    coverImg : {
        type : String,
        default : ""
    },

    followers :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user",
        }
    ],

    id : {
        type : String
    }
})

const user = new mongoose.model("user", userSchema);
module.exports = {user};