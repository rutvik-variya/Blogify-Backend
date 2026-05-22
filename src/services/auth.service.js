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


module.exports = { createUser, comparePassword }