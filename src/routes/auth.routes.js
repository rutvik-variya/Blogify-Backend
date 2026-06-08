const express = require("express");

const { register, login, refreshToken, logout, getProfile, updateProfile } = require("../controllers/auth.controller")

const validate = require("../middlewares/validate.middleware");
const verifyToken = require("../middlewares/auth.middleware");

const { registerSchema, loginSchema } = require("../validators/auth.validator");
const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshToken)
router.post("/logout", verifyToken, logout)

router.get("/me", verifyToken, getProfile)
router.put("/profile", verifyToken, updateProfile);
module.exports = router;


