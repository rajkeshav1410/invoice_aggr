import { authenticate, isAdmin } from "../middlewares/auth.middleware";
import { listUsers } from "../controllers/user.controller";

const express = require("express");
const router = express.Router();

router.route("/getAllUsers").get(authenticate, isAdmin, listUsers);

module.exports = router;