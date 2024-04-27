import { NextFunction, Request, Response } from "express";
import withErrorHandling from "../middlewares/handleAsync";
import db from "../common/database";
import { resolve } from "path";

const logs = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).sendFile(resolve(__dirname, "../../logs/application.log"));
};

export { logs };
