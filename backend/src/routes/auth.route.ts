import { authenticate } from "../middlewares/auth.middleware";
import { login, signup, me, logout } from "../controllers/auth.controller";

const express = require("express");
const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/me").get(authenticate, me);
router.route("/logout").get(authenticate, logout);

module.exports = router;
