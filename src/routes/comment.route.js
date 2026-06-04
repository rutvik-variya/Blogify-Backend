const express = require("express");
const router = express.Router();

const validate = require("../middlewares/validate.middleware");
const verifyToken = require("../middlewares/auth.middleware");
const { commentSchema } = require("../validators/comment.validator");
const { createComment, getBlogComment, deleteComment } = require("../controllers/comment.controller");
const verfiyToken = require("../middlewares/auth.middleware");
const authorizedRole = require("../middlewares/role.middleware");

router.post("/:blogId", verifyToken, validate(commentSchema), createComment)

router.delete("/:commentId", verifyToken, deleteComment)

router.get("/:blogId", getBlogComment)

module.exports = router;