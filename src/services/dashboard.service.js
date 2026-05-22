const ApiError = require("../utils/ApiError");

const blogModel = require("../models/blog.model");
const commentModel = require("../models/comment.model");


const getDashboardStatsService = async (userId) => {
    const totalBlogs = await blogModel.countDocuments({
        author: userId
    })

    const publishedBlogs = await blogModel.countDocuments({
        author: userId,
        status: "published"
    })

    const draftBlogs = await blogModel.countDocuments({
        author: userId,
        status: "draft"
    })

    let totallike = 0
    let totalBookmark = 0
    let totalComment = 0

    const blogs = await blogModel.find({
        author: userId
    })

    blogs.forEach((b) => {
        totallike += b.totalLikes;
        totalBookmark += b.totalBookmarks;
        totalComment += b.totalComments;
    })

    return {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        totallike,
        totalBookmark,
        totalComment
    }
}


const getReacentBlogService = async (userId) => {
    const recentBlogs = await blogModel.find({ author: userId })
        .sort({ createdAt: -1 })
        .limit(2)

    return recentBlogs;
}


const getDraftBlogsService = async (userId) => {
    const draftBlogs = await blogModel.find({
        author: userId,
        status: "draft"
    })

    return draftBlogs;
}


const getBookmarkBlogsService = async (userId) => {
    const bookmarkBlogs = await blogModel.find({
        bookmarks: userId,
    })
        .populate("author", "name -_id")
        .populate("category", "name -_id")
        .sort({ createdAt: -1 })

    return bookmarkBlogs;
}

const getUserActivityService = async (userId) => {
    const recentComment = await commentModel.find({
        user: userId
    })
        .populate("blog", "title slug")
        .sort({ createdAt: -1 })
        .limit(5)

    return recentComment;
}
module.exports = { getDashboardStatsService, getReacentBlogService, getDraftBlogsService, getBookmarkBlogsService, getUserActivityService }


