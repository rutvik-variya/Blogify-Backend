const express = require("express");
const router = express.Router();
const { getCategories } = require("../controllers/category.controller");
const { latestBlog } = require("../controllers/blog.controller")

// blogs 
router.get("/latestBlog", latestBlog)

// categories
router.get("/category", getCategories)

module.exports = router;