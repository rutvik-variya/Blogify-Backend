const { publishBlogSchema, draftBlogSchema } = require("../validators/blog.validator");

const validateBlog = (req, res, next) => {
    try {
        const schema = req.body.status === "draft" ? draftBlogSchema : publishBlogSchema;

        schema.parse(req.body);

        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message:
                error.errors?.[0]?.message ||
                "Validation failed",
        });
    }
};

module.exports = validateBlog;