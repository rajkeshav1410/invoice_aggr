import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../models/auth.model";
import prisma from "../database";
import { Role, User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies.jwt)
    return next({
      message: "You need to login first",
      statusCode: StatusCodes.UNAUTHORIZED,
    });

  const token = req.cookies.jwt.trim();
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as JwtPayload;

    if (
      !decoded.id ||
      decoded.reqIP !== req.ip ||
      decoded.agent !== req.headers["user-agent"]
    )
      return next({
        message: "Invalid JWT token",
        statusCode: StatusCodes.BAD_REQUEST,
      });

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
      },
    });
    if (!user)
      return next({
        message: "User not found",
        statusCode: StatusCodes.BAD_REQUEST,
      });

    req.user = user;
    next();
  } catch (error) {
    next({
      message:
        error instanceof jwt.TokenExpiredError
          ? "Token has expired"
          : "You need to login",
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }
};

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role == Role.ADMIN) {
    next();
  } else {
    return next({
      message: "You do not have permission to access this route",
      statusCode: StatusCodes.FORBIDDEN,
    });
  }
};

export { authenticate, isAdmin };
