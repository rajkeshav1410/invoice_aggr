import { NextFunction, Request, Response } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let message = err.message || "Internal Server Error";
  let statusCode = err.statusCode || 500;

  res.status(statusCode).json({ success: "false", message });
};

module.exports = errorHandler;
