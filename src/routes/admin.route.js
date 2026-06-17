const express = require("express");

const validate = require("../middlewares/validate.middleware");
const verifyToken = require("../middlewares/auth.middleware");
const { categorySchema } = require("../validators/category.validator");
const { createCategory, deleteCategory, updateCategory } = require("../controllers/category.controller");
const authorizedRole = require("../middlewares/role.middleware");
const { deleteBlog } = require("../controllers/blog.controller");


const { getAdminStats, getAllusers, deleteUser, getBlogs, changeBlogStatus, getAllComments, removeComment } =
    require("../controllers/admin.controller")

const router = express.Router();
router.use(
    verifyToken,
    authorizedRole("admin")
)

// stats
router.get("/stats", getAdminStats);

// manage users
router.get("/users", getAllusers);
router.delete("/users/:id", deleteUser);

// manage categories
router.post("/category", validate(categorySchema), createCategory);
router.delete("/category/:id", deleteCategory);
router.put("/category/:id", validate(categorySchema), updateCategory);

// manage blog
router.get("/blog", getBlogs);
router.delete("/blog/:id", deleteBlog)
router.patch("/blog/:id/status", changeBlogStatus)

// manage comments
router.get("/comments", getAllComments);
router.delete("/comments/:id", removeComment);

module.exports = router;