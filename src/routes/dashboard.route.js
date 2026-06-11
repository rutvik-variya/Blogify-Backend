const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const authorizedRole = require("../middlewares/role.middleware");
const { getDashboardStats, getRecentsBlogs, getMyBlogs, getBookmarkBlogs, getUserActivity } = require("../controllers/dashboard.controller");

router.get("/state", verifyToken, getDashboardStats);
router.get("/recent-blogs", verifyToken, getRecentsBlogs);
router.get("/bookmark-blogs", verifyToken, getBookmarkBlogs);
router.get("/activity", verifyToken, getUserActivity);

router.get("/my-blogs", verifyToken, getMyBlogs);
module.exports = router;