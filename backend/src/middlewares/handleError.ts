import { NextFunction, Request, Response } from "express";
import { ErrorHandle } from "../models/error.model";
import { ZodError } from "zod";
import logger from "../common/logger";
import { getReasonPhrase } from "http-status-codes";

const errorHandler = (
  err: ErrorHandle,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = err.message || "Internal Server Error";
  let statusCode = err.statusCode || 500;
  logger.error(`${statusCode} ${getReasonPhrase(statusCode)} | ${message}`);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = 400; // Bad Request status code for validation errors
    const formattedErrors = err.errors
      .map((error) => {
        return `${error.path.join(".")} ${error.message}`;
      })
      .join("; ");
    return res
      .status(statusCode)
      .json({ success: false, message: formattedErrors });
  }

  res.status(statusCode).json({ success: "false", message });
};

module.exports = errorHandler;
