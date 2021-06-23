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

    id : {
        type : String
    }
})

const user = new mongoose.model("user", userSchema);
module.exports = {user};