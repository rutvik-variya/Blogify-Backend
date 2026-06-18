const blogModel = require("../models/blog.model")
const slugify = require("slugify");
const ApiError = require("../utils/ApiError");
const cloudinary = require("../config/cloudinary")
const fs = require("fs")
const sanitizeHtml = require("sanitize-html");

const getPlainText = (html = "") => {
    return html
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();
};


const createNewBlog = async (req) => {
    const body = req.body;
    const file = req.file;

    const plainText = getPlainText(body.content || "");

    if (body.status === "published") {
        if (plainText.length === 0) {
            throw new ApiError(400, "Content is required");
        }

        if (!body.category) {
            throw new ApiError(400, "Category is required");
        }

        if (!file) {
            throw new ApiError(400, "Featured image is required");
        }

        if (plainText.length < 50) {
            throw new ApiError(
                400,
                "Published blog must contain at least 50 characters"
            );
        }

    }

    const slug = slugify(body.title, {
        lower: true,
        strict: true
    });

    const blogData = {
        title: body.title,
        slug,
        content: sanitizeHtml(body.content || ""),
        excerpt: body.excerpt || "",
        status: body.status || "draft",
        author: req.user.id,
    };

    if (body.category) {
        blogData.category = body.category;
    }

    try {
        if (file) {
            const cloudResult = await cloudinary.uploader.upload(file.path, {
                resource_type: "auto",
                folder: "blogs",
            });

            blogData.featuredImage = {
                public_id: cloudResult.public_id,
                url: cloudResult.secure_url,
            };
        }

        const blog = await blogModel.create(blogData);
        return blog;

    } catch (err) {
        console.error("Cloudinary upload error:", err); // IMPORTANT DEBUG
        throw new ApiError(400, "Image upload failed");
    }
    finally {
        if (file?.path) {
            fs.unlinkSync(file.path);
        }
    }
};

const removeBlog = async (id, reqUser) => {
    const blog = await blogModel.findById(id);

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    const isAuthor = blog.author.toString() === reqUser.id;
    const isAdmin = reqUser.role === "admin";

    if (!isAuthor && !isAdmin) {
        throw new ApiError(401, "Unauthorized");
    }

    if (blog.featuredImage?.public_id) {
        await cloudinary.uploader.destroy(blog.featuredImage.public_id);
    }

    await blogModel.findByIdAndDelete(id);

    return blog;
};


const editBlog = async (id, req) => {
    const body = req.body;
    const file = req.file;

    const blog = await blogModel.findById(id);

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    if (blog.author.toString() !== req.user.id) {
        throw new ApiError(401, "Unauthorized");
    }

    // Validation when publishing
    if (body.status === "published") {
        const plainText = getPlainText(
            body.content !== undefined
                ? body.content
                : blog.content
        );

        if (plainText.length < 50) {
            throw new ApiError(
                400,
                "Published blog must contain at least 50 characters"
            );
        }

        const category =
            body.category !== undefined
                ? body.category
                : blog.category;

        if (!category) {
            throw new ApiError(
                400,
                "Category is required"
            );
        }

        const hasImage =
            file ||
            blog.featuredImage?.url;

        if (!hasImage) {
            throw new ApiError(
                400,
                "Featured image is required"
            );
        }
    }

    let slug = blog.slug;

    if (body.title && body.title !== blog.title) {
        slug = slugify(body.title, {
            lower: true,
            strict: true,
        });
    }

    // Update fields safely

    if (body.title !== undefined) {
        blog.title = body.title;
    }

    blog.slug = slug;

    if (body.content !== undefined) {
        blog.content = sanitizeHtml(body.content);
    }

    if (body.excerpt !== undefined) {
        blog.excerpt = body.excerpt;
    }

    if (body.category !== undefined) {
        blog.category = body.category;
    }

    if (body.status !== undefined) {
        blog.status = body.status;
    }

    if (file) {
        try {
            if (blog.featuredImage?.public_id) {
                await cloudinary.uploader.destroy(
                    blog.featuredImage.public_id
                );
            }

            const cloudResult =
                await cloudinary.uploader.upload(
                    file.path,
                    {
                        resource_type: "auto",
                        folder: "blogs",
                    }
                );

            blog.featuredImage = {
                public_id: cloudResult.public_id,
                url: cloudResult.secure_url,
            };
        } catch (err) {
            console.error(
                "Cloudinary upload error:",
                err
            );
            throw new ApiError(
                400,
                "Image upload failed"
            );
        } finally {
            if (file?.path) {
                fs.unlinkSync(file.path);
            }
        }
    }

    await blog.save();

    return blog;
};

// get published blog --

// search - title, 
// filter - category wise filter,
// sort - latest ,oldest
// pagination

const getBlog = async (queryData) => {
    // default set default value
    const { search, category, sort = "latest", page = 1, limit = 3 } = queryData;

    const query = {
        status: "published"
    }

    if (search) {
        query.title = {
            $regex: search,
            $options: "i"
        }
    }

    if (category) {
        query.category = category
    }

    let sortOption = {}

    if (sort == "latest") {
        sortOption = { createdAt: -1 }
    }

    if (sort == "oldest") {
        sortOption = { createdAt: 1 }
    }

    // pagination logic for infinite scrolling

    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage

    const totalBlogs = await blogModel.countDocuments(query);

    const blogs = await blogModel.find(query)
        .populate("author", "name avtar")
        .populate("category", "name")
        .sort(sortOption)
        .skip(skip)
        .limit(perPage)

    return {
        blogs,
        currentPage,
        perPage,
        totalBlogs,
        totalPage: Math.ceil(totalBlogs / perPage),
        hasMore: currentPage < Math.ceil(totalBlogs / perPage)
    }
}

const fetchSingleBlog = async (slug) => {
    const blog = await blogModel.findOne({
        slug,
        status: "published",
    }).populate("author", "name email")
        .populate("category", "name");

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    blog.views += 1;

    await blog.save();

    return blog;
}

const toggledLike = async (blogId, userId) => {
    const blog = await blogModel.findById(blogId);
    if (!blog) {
        throw new ApiError(404, "Blog not Found")
    }

    const isLiked = blog.likes.includes(userId);

    (isLiked) ? blog.likes.pull(userId) : blog.likes.push(userId)

    blog.totalLikes = blog.likes.length;
    await blog.save();
    return {
        liked: !isLiked,
        totalLikes: blog.totalLikes
    }
}


const toggledBookmark = async (blogId, userId) => {
    const blog = await blogModel.findById(blogId);
    if (!blog) {
        throw new ApiError(404, "Blog not Found")
    }

    const isBookMark = blog.bookmarks.includes(userId);
    (isBookMark) ? blog.bookmarks.pull(userId) : blog.bookmarks.push(userId)

    blog.totalBookmarks = blog.bookmarks.length;
    await blog.save();
    return {
        bookmark: !isBookMark,
        totalBookMark: blog.totalBookmarks
    }
}

const latestBlogService = async () => {
    const blog = await blogModel.find({ status: "published" })
        .populate("author", "name avtar")
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .limit(3);

    if (!blog) {
        throw new ApiError(404, "Blog not Found")
    }
    return blog;
}

module.exports = { createNewBlog, removeBlog, editBlog, getBlog, fetchSingleBlog, toggledLike, toggledBookmark, latestBlogService }