const commentModel = require("../models/comment.model");
const blogModel = require("../models/blog.model");
const ApiError = require("../utils/ApiError");

const createNewComment = async (blogId, userId, body) => {
    const blog = await blogModel.findById(blogId);

    if (!blog) {
        throw new ApiError(404, "Blog not Found")

    }

    const comment = await commentModel.create({
        content: body.content,
        user: userId,
        blog: blogId
    })

    blog.totalComments += 1;
    await blog.save();

    return await commentModel.findById(comment._id).populate("user", "name avtar")
}

const getComment = async (blogId) => {
    const comment = await commentModel.find({ blog: blogId })
        .populate("user", "name avtar")
        .populate("blog", "title")
        .populate("parentComment", "content")
        .sort({ createdAt: -1 })
    return comment;
}

const removeComment = async (commentId, user) => {
    const comment = await commentModel.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not Found");
    }

    if (comment.user.toString() != user.id) {
        throw new ApiError(401, "Unauthorized")
    }

    await commentModel.findByIdAndDelete(commentId);

    await blogModel.findByIdAndUpdate(comment.blog, {
        $inc: {
            totalComments: -1
        }
    })
    return null;
}

module.exports = { createNewComment, getComment, removeComment }

