import { NextFunction, Request, Response } from "express";
import { ErrorHandle } from "../models/error.model";

const errorHandler = (err: ErrorHandle, req: Request, res: Response, next: NextFunction) => {
  const message = err.message || "Internal Server Error";
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({ success: "false", message });
};

module.exports = errorHandler;
