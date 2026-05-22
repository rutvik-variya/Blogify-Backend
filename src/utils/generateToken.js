const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, role) => {
    return jwt.sign(
        {
            id: userId,
            role: role
        },
        process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE
    }
    )
}

const generateRefreshToken = (userId, role) => {
    return jwt.sign(
        {
            id: userId,
            role: role
        },
        process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE
    }
    )
}

module.exports = { generateAccessToken, generateRefreshToken }