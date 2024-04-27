import { authenticate, isAdmin } from "../middlewares/auth.middleware";
import withErrorHandling from "../middlewares/handleAsync";
import { listUsers, listUsersWork } from "../controllers/user.controller";

const express = require("express");
const router = express.Router();

router
  .route("/getAllUsers")
  .get(authenticate, isAdmin, withErrorHandling(listUsers));
router
  .route("/getUsersWork")
  .get(authenticate, withErrorHandling(listUsersWork));

module.exports = router;
