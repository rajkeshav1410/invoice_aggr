import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import prisma from "../database";
import withErrorHandling from "../middlewares/handleAsync";
import { LoginRequest, SignupRequest } from "../models/auth.model";

const login = withErrorHandling(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginRequest: LoginRequest = req.body;
    const existingUser = await prisma.user.findFirst({
      where: {
        email: loginRequest.email,
      },
    });

    if (!existingUser)
      return next({
        message: `User with email ${loginRequest.email} doesn't exists`,
        statusCode: StatusCodes.UNAUTHORIZED,
      });

    const passwordMatch = await bcrypt.compare(
      loginRequest.password,
      existingUser.password
    );
    if (!passwordMatch)
      return next({
        message: "The password does not match",
        statusCode: StatusCodes.UNAUTHORIZED,
      });

    createJwtToken(req, res, existingUser);
  }
);

const signup = withErrorHandling(
  async (req: Request, res: Response, next: NextFunction) => {
    const signupRequest: SignupRequest = req.body;
    const existingUser = await prisma.user.findFirst({
      where: {
        email: signupRequest.email,
      },
    });

    if (existingUser)
      return next({
        message: `User with email ${signupRequest.email} already exists`,
        statusCode: StatusCodes.FORBIDDEN,
      });

    const salt = await bcrypt.genSalt(10);
    signupRequest.password = await bcrypt.hash(signupRequest.password, salt);
    const { id, password, ...newUser } = await prisma.user.create({
      data: {
        ...signupRequest,
      },
    });

    res.status(StatusCodes.ACCEPTED).json(newUser);
  }
);

const me = withErrorHandling(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, password, ...currentUser } = req.user ? req.user : ({} as User);
    res.status(StatusCodes.OK).json(currentUser);
  }
);

const logout = withErrorHandling(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.id)
      return next({
        message: "You must be logged in",
        statusCode: StatusCodes.UNAUTHORIZED,
      });

    const currentUser = await prisma.user.findFirst({
      where: {
        id: req.user?.id,
      },
    });
    res.cookie("jwt", null, { expires: new Date(0) });
    res.status(StatusCodes.OK).json(currentUser);
  }
);

const createJwtToken = (req: Request, res: Response, user: User) => {
  const payload = {
    id: user.id,
    role: user.role,
    reqIP: req.ip,
    agent: req.headers["user-agent"],
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
    expiresIn: parseInt(process.env.JWT_EXPIRE || "3600", 10),
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRE || "60", 10) * 60 * 1000
    ),
  });
  const { id, password, ...loggedUser } = user;

  res.status(StatusCodes.OK).json(loggedUser);
};

export { login, signup, me, logout };
