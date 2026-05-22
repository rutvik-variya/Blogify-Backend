const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const { getDashboardStatsService, getReacentBlogService, getDraftBlogsService, getBookmarkBlogsService, getUserActivityService } =
    require("../services/dashboard.service");


const getDashboardStats = async (req, res) => {
    try {
        const result = await getDashboardStatsService(req.user.id);
        return res.status(200).json(new ApiResponse(200, "Get dashboard stats", { result }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}


const getRecentsBlogs = async (req, res) => {
    try {
        const result = await getReacentBlogService(req.user.id);
        return res.status(200).json(new ApiResponse(200, "Get Recent Blogs", { result }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}


const getDraftBlogs = async (req, res) => {
    try {
        const result = await getDraftBlogsService(req.user.id);
        return res.status(200).json(new ApiResponse(200, "Get Draft Blogs", { result }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const getBookmarkBlogs = async (req, res) => {
    try {
        const result = await getBookmarkBlogsService(req.user.id);
        return res.status(200).json(new ApiResponse(200, "Get Bookmark Blogs", { result }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const getUserActivity = async (req, res) => {
    try {
        const result = await getUserActivityService(req.user.id);
        return res.status(200).json(new ApiResponse(200, "Get User Activity", { result }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

module.exports = { getDashboardStats, getRecentsBlogs, getDraftBlogs, getBookmarkBlogs, getUserActivity }