const ApiError = require("../utils/ApiError");
const authorizedRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json(new ApiError(403, "Access Denied"));
        }
        next();
    }
}

module.exports = authorizedRole;