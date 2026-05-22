const express = require("express");
const validate = require("../middlewares/validate.middleware");
const verifyToken = require("../middlewares/auth.middleware");
const { blogSchema, updateBlogSchema } = require("../validators/blog.validator");
const { createBlog, deleteBlog, updateBlog, getAllBlog, getSingleBlog, toggleLike, toggleBookmark } = require("../controllers/blog.controller")

const upload = require("../middlewares/upload.middleware")
const router = express.Router();


router.post("/", verifyToken, upload.single("image"), validate(blogSchema), createBlog);
router.delete("/:id", verifyToken, deleteBlog)
router.put("/:id", verifyToken, upload.single("image"), validate(updateBlogSchema), updateBlog)

router.patch("/:id/like", verifyToken, toggleLike)
router.patch("/:id/bookmark", verifyToken, toggleBookmark)

// public route
router.get("/", getAllBlog)
router.get("/:slug", getSingleBlog)

module.exports = router;

