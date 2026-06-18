const z = require("zod");

const publishBlogSchema = z.object({
    title: z.string().min(5).max(150),
    content: z.string().min(1),
    excerpt: z.string().max(300).optional(),
    category: z.string().min(1, "Category is required"),
    status: z.literal("published"),
});

const draftBlogSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().optional(),
    excerpt: z.string().optional(),
    category: z.string().optional(),
    status: z.literal("draft"),
});

module.exports = {
    publishBlogSchema,
    draftBlogSchema,
};