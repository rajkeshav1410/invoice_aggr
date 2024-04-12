import { NextFunction, Request, Response } from "express";
import withErrorHandling from "../middlewares/handleAsync";

const listUsers = withErrorHandling(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({});
  }
);

export { listUsers };
