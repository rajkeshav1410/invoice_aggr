import { authenticate, isAdmin } from "../middlewares/auth.middleware";
import withErrorHandling from "../middlewares/handleAsync";
import { listUsers } from "../controllers/user.controller";

const express = require("express");
const router = express.Router();

router
  .route("/getAllUsers")
  .get(authenticate, isAdmin, withErrorHandling(listUsers));

module.exports = router;
