const express = require("express");
const validate = require("../middlewares/validate.middleware");
const verifyToken = require("../middlewares/auth.middleware");
const { blogSchema, updateBlogSchema } = require("../validators/blog.validator");
const { createBlog, deleteBlog, updateBlog, getAllBlog, getSingleBlog, toggleLike, toggleBookmark } = require("../controllers/blog.controller")
const { changeBlogStatus } = require("../controllers/admin.controller")
const validateBlog = require("../middlewares/validateBlog.middleware")

const upload = require("../middlewares/upload.middleware")
const router = express.Router();


router.post("/", verifyToken, upload.single("featuredImage"), validateBlog, createBlog);
router.delete("/:id", verifyToken, deleteBlog)
router.put("/:id", verifyToken, upload.single("featuredImage"), validateBlog, updateBlog)
router.patch("/:id/status", verifyToken, changeBlogStatus)


// like and bookmark 
router.patch("/:id/like", verifyToken, toggleLike)
router.patch("/:id/bookmark", verifyToken, toggleBookmark)

// public route
router.get("/", getAllBlog)
router.get("/:slug", getSingleBlog)

module.exports = router;

