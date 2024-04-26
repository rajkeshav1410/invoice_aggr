require("dotenv").config();

import cors, { CorsOptions } from "cors";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import apiLogger from "./middlewares/logger.middleware";
const errorHandler = require("./middlewares/handleError");
const swaggerFile = require("../dist/swagger_output.json");
const userRoute = require("./routes/user.route");
const authRoute = require("./routes/auth.route");
const enterpriseRoute = require("./routes/enterprise.route");

const app: Application = express();
const swaggerUi = require("swagger-ui-express");
const url = `${process.env.BASE_URL}:${process.env.PORT}`;

const corsOptions: CorsOptions = {
  origin: '*',
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.set("trust proxy", true);
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(apiLogger);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/enterprise", enterpriseRoute);

app.use(errorHandler);

// start the server
app.listen(
  parseInt(process.env.PORT || "8081", 10),
  process.env.BASE_URL || "localhost",
  () => {
    console.log(`server running : ${url}`);
  }
);
