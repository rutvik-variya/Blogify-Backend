const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { createNewBlog, removeBlog, editBlog, getBlog, fetchSingleBlog, toggledLike, toggledBookmark } = require("../services/blog.service")

const createBlog = async (req, res) => {
    try {
        const blog = await createNewBlog(req);
        return res.status(201).json(new ApiResponse(201, "Blog created successfully", { blog }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const deleteBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const blog = await removeBlog(id, req.user);
        return res.status(200).json(new ApiResponse(200, "Blog deleted successfully"));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await editBlog(id, req);
        return res.status(200).json(new ApiResponse(200, "Blog updated successfully", { blog }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const getAllBlog = async (req, res) => {
    try {
        const blogs = await getBlog(req.query);
        return res.status(200).json(new ApiResponse(200, "Blogs fetched", { blogs }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const getSingleBlog = async (req, res) => {
    try {
        const blogs = await fetchSingleBlog(req.params.slug);
        return res.status(200).json(new ApiResponse(200, "Blogs fetched", { blogs }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const toggleLike = async (req, res) => {
    try {
        const blog = await toggledLike(req.params.id, req.user.id);
        const message = (blog.liked) ? "Blog liked" : "Blog unliked";
        return res.status(200).json(new ApiResponse(200, message, { blog }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const toggleBookmark = async (req, res) => {
    try {
        const blog = await toggledBookmark(req.params.id, req.user.id);
        const message = (blog.bookmark) ? "Blog Bookmaked" : "Bookmark Removed";
        return res.status(200).json(new ApiResponse(200, message, { blog }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

module.exports = { createBlog, deleteBlog, updateBlog, getAllBlog, getSingleBlog, toggleLike, toggleBookmark }

