const mongoose = require("mongoose");
const { refreshToken } = require("../config/jwt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    avtar: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    refreshToken: {
        type: String,
        default: ""
    }
},
    {
        timestamps: true
    }
)

const user = mongoose.model("User", userSchema);
module.exports = user;