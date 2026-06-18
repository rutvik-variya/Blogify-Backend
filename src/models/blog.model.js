const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        required: true,
    },
    content: {
        type: String,
        default: ""
    },
    except: {
        type: String,
        trim: true
    },
    featuredImage: {
        public_id: String,
        url: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft"
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    totalLikes: {
        type: Number,
        default: 0
    },
    totalBookmarks: {
        type: Number,
        default: 0
    },
    totalComments: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true
})

const blog = mongoose.model("Blog", blogSchema);
module.exports = blog;