require("dotenv").config();

import cors, { CorsOptions } from "cors";
import express, { Application, Request, Response } from "express";
const userRoute = require("./routes/user.route");
const errorHandler = require("./middlewares/handleError");
const swaggerFile = require("../dist/swagger_output.json");

const app: Application = express();
const swaggerUi = require("swagger-ui-express");
const url = `${process.env.BASE_URL}:${process.env.PORT}`;

const corsOptions: CorsOptions = {
  origin: url,
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(express.json());
app.use(cors(corsOptions));
app.use(errorHandler);

app.use("/api/v1/user", userRoute);


// app.get("/", (req: Request, res: Response) => {
//   res.send("Welcome to Invoice_aggr");
// });

// start the server
app.listen(
  parseInt(process.env.PORT || "8081", 10),
  process.env.BASE_URL || "localhost",
  () => {
    console.log(`server running : ${url}`);
  }
);
