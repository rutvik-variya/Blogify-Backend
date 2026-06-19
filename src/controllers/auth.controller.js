const userModel = require("../models/user.model")

const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken")
const { createUser, comparePassword, getProfileService, updateProfileService, changePasswordService } = require("../services/auth.service");


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
            return res.status(401).json(
                new ApiError(401, "Invalid credentials")
            );
        }

        const matchPassword = await comparePassword(user.password, password);

        if (!matchPassword) {
            return res.status(401).json(
                new ApiError(401, "Invalid credentials")
            );
        }

        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id, user.role);

        user.refreshToken = refreshToken;
        await user.save();
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        return res.status(200).json(
            new ApiResponse(200, "Login Successfully", {
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    avtar: user.avtar
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
            secure: true,
            sameSite: "none",
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
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        return res.status(200).json(new ApiResponse(200, "Logout Successfull"));
    }
    catch (err) {
        console.log(err);
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}


const getProfile = async (req, res) => {
    try {
        const result = await getProfileService(req.user.id);
        return res.status(200).json(new ApiResponse(200, "Profile fetched successfully", { result }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const updateProfile = async (req, res) => {
    try {
        const updateData = {};
        if (req.body.name) {
            updateData.name = req.body.name;
        }

        if (req.body.username) {
            updateData.username = req.body.username;
        }

        if (req.body.email) {
            updateData.email = req.body.email;
        }

        if (req.file) {
            updateData.avtar = req.file.path;
        }

        const updatedUser = await updateProfileService(req.user.id, updateData);
        return res.status(200).json(new ApiResponse(200, "Profile Updated Successfully", { updatedUser }));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

const changeUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const existUser = await userModel.findById(req.user.id);

        const isPasswordValid = await comparePassword(existUser.password, currentPassword);
        if (!isPasswordValid) {
            return res.status(400).json(new ApiError(400, "Current password is incorrect"));
        }

        await changePasswordService(req.user.id, newPassword);
        return res.status(200).json(new ApiResponse(200, "Password changed sucessfully"));
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
}

module.exports = { register, login, refreshToken, logout, getProfile, updateProfile, changeUserPassword }