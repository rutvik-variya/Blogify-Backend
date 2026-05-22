const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    blog: {
        type: mongoose.Schema.ObjectId,
        ref: "Blog",
        required: true
    },
    parentComment: {
        type: mongoose.Schema.ObjectId,
        ref: "Comment",
        default: null,
    },
    isEdited: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const comment = mongoose.model("Comment", commentSchema);
module.exports = comment;
