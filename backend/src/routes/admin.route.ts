import withErrorHandling from "../middlewares/handleAsync";
import { logs } from "../controllers/admin.controller";

const express = require("express");
const router = express.Router();

router.route("/logs").get(withErrorHandling(logs));

module.exports = router;