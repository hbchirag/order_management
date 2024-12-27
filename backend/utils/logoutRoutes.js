const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { logout } = require("../controllers/authController");

router.post("/logout", authMiddleware, logout);

module.exports = router;
