const express = require("express");

const { register, login, refreshToken, logout, getProfile, updateProfile, changeUserPassword } = require("../controllers/auth.controller")

const validate = require("../middlewares/validate.middleware");
const verifyToken = require("../middlewares/auth.middleware");

const upload = require("../middlewares/upload.middleware")

const { registerSchema, loginSchema } = require("../validators/auth.validator");
const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshToken)
router.post("/logout", verifyToken, logout)

router.get("/me", verifyToken, getProfile)
router.put("/profile", verifyToken, upload.single("avtar"), updateProfile);
router.put("/change-password", verifyToken, changeUserPassword)


module.exports = router;


