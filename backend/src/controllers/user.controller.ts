import { NextFunction, Request, Response } from "express";
import withErrorHandling from "../middlewares/handleAsync";
import prisma from "../common/database";

const listUsers = withErrorHandling(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  }
);

export { listUsers };
