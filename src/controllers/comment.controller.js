const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { createNewComment, getComment, removeComment } = require("../services/comment.service")

const createComment = async (req, res) => {
    try {
        const comment = await createNewComment(req.params.blogId, req.user.id, req.body);
        return res.status(201).json(new ApiResponse(201, "Comment added successfully", { comment }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const getBlogComment = async (req, res) => {
    try {
        const comment = await getComment(req.params.blogId);
        return res.status(200).json(new ApiResponse(200, "Get blog comment", { comment }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const deleteComment = async (req, res) => {
    try {
        const comment = await removeComment(req.params.commentId, req.user);
        return res.status(200).json(new ApiResponse(200, "Comment deleted successfully",));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

module.exports = { createComment, getBlogComment, deleteComment }