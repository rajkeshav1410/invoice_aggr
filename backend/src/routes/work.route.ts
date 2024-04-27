import { authenticate } from "../middlewares/auth.middleware";
import withErrorHandling from "../middlewares/handleAsync";
import {
  createWork,
  editWork,
  getWorks,
  deleteWork,
} from "../controllers/work.controller";

const express = require("express");
const router = express.Router();

router.route("/list").get(authenticate, withErrorHandling(getWorks));
router.route("/create").post(authenticate, withErrorHandling(createWork));
router.route("/edit").post(authenticate, withErrorHandling(editWork));
router.route("/remove").post(authenticate, withErrorHandling(deleteWork));

module.exports = router;
