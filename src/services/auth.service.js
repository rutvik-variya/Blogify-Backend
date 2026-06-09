const bcrypt = require("bcryptjs")
const user = require("../models/user.model");
const fs = require("fs")
const cloudinary = require("../config/cloudinary")


const createUser = async (data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await user.create({
        ...data,
        password: hashedPassword,
    })

}

const comparePassword = async (hashedPassword, password) => {
    return await bcrypt.compare(password, hashedPassword)
}


const getProfileService = async (userId) => {
    const profileUser = await user.findById(userId).select(
        "-password -refreshToken"
    )
    if (!profileUser) {
        throw new ApiError(400, "User not found")
    }
    return profileUser
}

const updateProfileService = async (userId, data) => {
    const updateProfileData = {};

    if (data.name) updateProfileData.name = data.name;
    if (data.username) updateProfileData.username = data.username;
    if (data.email) updateProfileData.email = data.email;

    try {
        const existingUser = await user.findById(userId);
        if (data.avtar) {
            if (existingUser?.avtar?.public_id) {
                await cloudinary.uploader.destroy(
                    existingUser.avtar.public_id
                );
            }
            const cloudResult = await cloudinary.uploader.upload(data.avtar,
                {
                    folder: "user",
                    resource_type: "image"
                }
            );

            updateProfileData.avtar = {
                public_id: cloudResult.public_id,
                url: cloudResult.secure_url
            };
        }

        const updatedUser = await user.findByIdAndUpdate(userId, updateProfileData,
            {
                new: true,
                runValidators: true
            }
        ).select("-password -refreshToken");

        return updatedUser;
    }

    finally {
        if (data.avtar && fs.existsSync(data.avtar)) {
            fs.unlinkSync(data.avtar);
        }
    }
};

const changePasswordService = async (userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await user.findByIdAndUpdate(
        userId,
        {
            password: hashedPassword,
        }
    );
}

module.exports = { createUser, comparePassword, getProfileService, updateProfileService, changePasswordService }