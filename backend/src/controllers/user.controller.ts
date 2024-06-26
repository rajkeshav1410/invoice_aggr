import { NextFunction, Request, Response } from "express";
import withErrorHandling from "../middlewares/handleAsync";
import db from "../common/database";

const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  const users = await db.user.findMany();
  res.status(200).json(users);
};

export { listUsers };
