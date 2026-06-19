const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors")
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.route")
const blogRoute = require("./routes/blog.route")
const commentRoute = require("./routes/comment.route")

const dashboardRoute = require("./routes/dashboard.route")

const publicRoute = require("./routes/public.route")

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("CORS blocked"));
        },
        credentials: true,
    })
);

app.use("/api/auth/", authRoutes);
app.use("/api/admin/", adminRoutes);

app.use("/api/blog/", blogRoute);
app.use("/api/comment/", commentRoute);

app.use("/api/dashboard/", dashboardRoute);

app.use("/api", publicRoute);

module.exports = app;   
