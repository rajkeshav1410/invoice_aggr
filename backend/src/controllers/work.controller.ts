import { NextFunction, Request, Response } from "express";
import withErrorHandling from "../middlewares/handleAsync";
import { WorkRequest } from "../models/work.model";
import prisma from "../database";
import { Work } from "@prisma/client";

const login = withErrorHandling(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginRequest: Work = req.body;
  }
);
