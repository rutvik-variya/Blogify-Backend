const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiError");

const verfiyToken = (req, res, next) => {
    // verify using header

    // const authorization = req.headers.authorization;
    // if (!authorization) return res.status(401).json(new ApiError(401, "Token not found"));
    // const token = req.headers.authorization.split(" ")[1];

    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json(new ApiError(401, "Token not found"))

    try {
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decode;
        next();
    } catch (err) {
        res.status(400).json(new ApiError(400, "Token is not valid"))
    }
}

module.exports = verfiyToken;
