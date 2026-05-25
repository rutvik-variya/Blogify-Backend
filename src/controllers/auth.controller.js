const userModel = require("../models/user.model")

const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken")
const { createUser, comparePassword } = require("../services/auth.service");


const jwt = require("jsonwebtoken");
const { strictObject } = require("zod");

const register = async (req, res) => {
    try {
        const { email } = req.body;
        const existUser = await userModel.findOne({ email });

        if (existUser) {
            return res.status(400).json(new ApiError(400, "Use Different Email"));
        }
        const user = await createUser(req.body);
        return res.status(201).json(new ApiResponse(201, "User Registered Successfully", { user }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json(
                new ApiError(400, "Invalid credentials")
            );
        }

        const matchPassword = await comparePassword(user.password, password);

        if (!matchPassword) {
            return res.status(400).json(
                new ApiError(400, "Invalid credentials")
            );
        }

        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id, user.role);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });

        return res.status(200).json(
            new ApiResponse(200, "Login Successfully", {
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
                accessToken,
            })
        );

    } catch (err) {
        console.log(err);
        return res.status(500).json(
            new ApiError(500, "Internal server error")
        );
    }
};


const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json(new ApiError(401, "Refresh token required"));
    }

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await userModel.findOne({ _id: decoded.id });

        if (!user || user.refreshToken !== token) {
            return res.status(403).json(new ApiError(403, "Invalid Refresh Token"));
        }

        const newAccessToken = generateAccessToken(user.id, user.role);

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });

        return res.status(200).json(new ApiResponse(200, "New AccessToken generated", { newAccessToken }));
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const logout = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.user.id });
        user.refreshToken = "";
        await user.save();
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).json(new ApiResponse(200, "Logout Successfull"));
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}


module.exports = { register, login, refreshToken, logout }