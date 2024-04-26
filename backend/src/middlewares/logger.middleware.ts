import { NextFunction, Request, Response } from "express";
import logger from "../common/logger";

const apiLogger = async (req: Request, res: Response, next: NextFunction) => {
  logger.info(
    `${req.method} ${req.url}${
      Object.keys(req.params).length > 0
        ? "\nParams: " + JSON.stringify(req.params)
        : ""
    }${
      Object.keys(req.body).length > 0
        ? "\nBody: " + JSON.stringify(req.body)
        : ""
    }`
  );
  next();
};

export default apiLogger;
