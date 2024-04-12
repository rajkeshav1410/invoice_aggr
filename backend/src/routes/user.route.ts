import { listUsers } from "../controllers/user.controller";

const express = require("express");
const router = express.Router();

router.route("/").get(listUsers);

module.exports = router;