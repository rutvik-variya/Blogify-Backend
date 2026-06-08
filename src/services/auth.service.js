const bcrypt = require("bcryptjs")
const user = require("../models/user.model");

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
    const updatedUser = await user.findByIdAndUpdate(userId, data, {
        new: true,
        runValidators: true
    }).select(" -password -refreshToken")

    if (!updatedUser) {
        throw new ApiError(400, "user not updated")
    }
    return updatedUser;
}

module.exports = { createUser, comparePassword, getProfileService, updateProfileService }