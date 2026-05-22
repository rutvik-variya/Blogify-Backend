const z = require("zod");


const blogSchema = z.object({
    title: z.string().min(5).max(150),
    content: z.string().min(50),
    excerpt: z.string().max(300).optional(),
    category: z.string().min(1, "Category is required"),
    status: z.enum(["draft", "published"]).optional()
});

const updateBlogSchema = blogSchema.partial();


module.exports = { blogSchema, updateBlogSchema }