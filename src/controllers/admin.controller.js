
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const { getAdminstatService, getUsers, removeUser, fetchBlog, toggleBlogStatus, allCommentService, deleteCommentService }
    = require("../services/admin.service");

const getAdminStats = async (req, res) => {
    try {
        const result = await getAdminstatService();
        return res.status(200).json(new ApiResponse(200, "Get admin stats", result));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const getAllusers = async (req, res) => {
    try {
        const users = await getUsers();
        return res.status(200).json(new ApiResponse(200, "All Users", users));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await removeUser(req.params.id)
        return res.status(200).json(new ApiResponse(200, "User Deleted Successfully"));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const getBlogs = async (req, res) => {
    try {
        const blogs = await fetchBlog();
        return res.status(200).json(new ApiResponse(200, "Blogs fetched", { blogs }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const changeBlogStatus = async (req, res) => {
    try {
        const blog = await toggleBlogStatus(req.params.id, req.body.status)
        return res.status(200).json(new ApiResponse(200, "Blogs fetched", { blog }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}


const getAllComments = async (req, res) => {
    try {
        const comments = await allCommentService();
        return res.status(200).json(new ApiResponse(200, "Comments fetched", { comments }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const removeComment = async (req, res) => {
    try {
        const result = await deleteCommentService(req.params.id);
        return res.status(200).json(new ApiResponse(200, "Comments deleted"));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

module.exports = { getAdminStats, getAllusers, deleteUser, getBlogs, changeBlogStatus, getAllComments, removeComment }
