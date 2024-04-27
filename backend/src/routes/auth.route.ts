import { authenticate } from "../middlewares/auth.middleware";
import withErrorHandling from "../middlewares/handleAsync";
import { login, signup, me, logout } from "../controllers/auth.controller";

const express = require("express");
const router = express.Router();

router.route("/signup").post(withErrorHandling(signup));
router.route("/login").post(withErrorHandling(login));
router.route("/me").get(authenticate, withErrorHandling(me));
router.route("/logout").get(authenticate, withErrorHandling(logout));

module.exports = router;
