import { authenticate } from "../middlewares/auth.middleware";
import withErrorHandling from "../middlewares/handleAsync";
import {
  createLegend,
  editLegend,
  getLegends,
  deleteLegend,
} from "../controllers/legend.controller";

const express = require("express");
const router = express.Router();

router.route("/list").get(authenticate, withErrorHandling(getLegends));
router.route("/create").post(authenticate, withErrorHandling(createLegend));
router.route("/edit").post(authenticate, withErrorHandling(editLegend));
router.route("/remove").post(authenticate, withErrorHandling(deleteLegend));

module.exports = router;
