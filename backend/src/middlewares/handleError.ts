import { NextFunction, Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { ZodError } from "zod";
import { ErrorHandle } from "../models/error.model";
import logger from "../common/logger";

const errorHandler = (
  err: ErrorHandle,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let message = err.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = StatusCodes.BAD_REQUEST; // Bad Request status code for validation errors
    message = err.errors
      .map((error) => {
        return `${error.path.join(".")} ${error.message}`;
      })
      .join("; ");
  }


  logger.error(`${statusCode} ${getReasonPhrase(statusCode)} | ${message}`);
  res.status(statusCode).json({ success: "false", message });
};

module.exports = errorHandler;
