import { authenticate } from "../middlewares/auth.middleware";
import { createEnterprise } from "../controllers/enterprise.controller";

const express = require("express");
const router = express.Router();

router.route("/create").get(authenticate, createEnterprise);

module.exports = router;
