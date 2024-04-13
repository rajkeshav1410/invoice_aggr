import { NextFunction, Request, Response } from "express";
import withErrorHandling from "../middlewares/handleAsync";
import prisma from "../database";

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Retrieves a list of users.
 *     description: Retrieves a list of users from the database.
 *     responses:
 *       200:
 *         description: A list of users.
 */
const listUsers = withErrorHandling(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  }
);

export { listUsers };
