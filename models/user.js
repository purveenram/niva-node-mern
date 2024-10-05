const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true,
        trim: true
    },
    userEmail: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    userPassword: {
        type: String,
        require: true,
        trim: true
    },
});

module.exports = mongoose.model("User",userSchema);