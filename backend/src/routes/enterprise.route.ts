import { authenticate } from "../middlewares/auth.middleware";
import { createEnterprise } from "../controllers/enterprise.controller";

const express = require("express");
const router = express.Router();

router.route("/create").post(authenticate, createEnterprise);

module.exports = router;
