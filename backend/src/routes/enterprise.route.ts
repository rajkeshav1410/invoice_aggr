import { authenticate } from "../middlewares/auth.middleware";
import withErrorHandling from "../middlewares/handleAsync";
import { createEnterprise, editEnterprise, getEnterprises, removeEnterprise } from "../controllers/enterprise.controller";

const express = require("express");
const router = express.Router();

router.route("/list").get(authenticate, withErrorHandling(getEnterprises));
router.route("/create").post(authenticate, withErrorHandling(createEnterprise));
router.route("/edit").post(authenticate, withErrorHandling(editEnterprise));
router.route("/remove").post(authenticate, withErrorHandling(removeEnterprise));

module.exports = router;
