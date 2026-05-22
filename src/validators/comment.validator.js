const z = require("zod");

const commentSchema = z.object({
    content: z.string().min(1, "Comment is required").max(1000),
    parentComment: z.string().optional()
});

module.exports = { commentSchema };    