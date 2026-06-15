const userModel = require("../models/user.model");
const categoryModel = require("../models/category.model");
const blogModel = require("../models/blog.model");
const commentModel = require("../models/comment.model");
const ApiError = require("../utils/ApiError")

const getAdminstatService = async () => {
    const totalUsers = await userModel.countDocuments();
    const totalCategories = await categoryModel.countDocuments();
    const totalBlogs = await blogModel.countDocuments();
    const publishBlogs = await blogModel.countDocuments({
        status: "published"
    })
    const draftBlogs = await blogModel.countDocuments({
        status: "draft"
    })
    const totalComments = await commentModel.countDocuments();

    return {
        totalUsers,
        totalCategories,
        totalBlogs,
        publishBlogs,
        draftBlogs,
        totalComments
    }
}

const getUsers = async () => {
    const users = await userModel.find({ role: "user" }).select("-password -refreshToken");
    if (!users) {
        throw new ApiError(404, "Users not get")
    }
    return users;
}

const removeUser = async (userId) => {
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
        throw new ApiError(404, "Users not find")
    }
    return null;
}

const fetchBlog = async () => {
    const blogs = await blogModel.find();
    if (!blogs) {
        throw new ApiError(404, "blogs not get")
    }
    return blogs;
}

const toggleBlogStatus = async (blogId, status) => {
    const blog = await blogModel.findById(blogId);
    if (!blog) {
        throw new ApiError(404, "blogs not find")
    }

    blog.status = status;
    await blog.save();
    return blog;
}

const allCommentService = async () => {
    const comments = await commentModel.find();
    if (!comments) {
        throw new ApiError(404, "Comments not find")
    }

    return comments;
}


const deleteCommentService = async (commentId) => {
    const comment = await commentModel.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comments not find")
    }

    await blogModel.findByIdAndUpdate(comment.blog, {
        $inc: {
            totalComments: -1,
        },
    });

    await commentModel.findByIdAndDelete(commentId);
    return null;
};

module.exports = { getAdminstatService, getUsers, removeUser, fetchBlog, toggleBlogStatus, allCommentService, deleteCommentService }