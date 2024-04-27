import { NextFunction, Request, Response } from "express";
import { Access } from "@prisma/client";
import db from "../common/database";
import { EMPTY_STRING } from "../common/constants";
import { throwError } from "../common/util";
import logger from "../common/logger";
import { WorkCreateSchema, WorkCreateRequest } from "../models/work.model";
import { StatusCodes } from "http-status-codes";

const createWork = async (req: Request, res: Response, next: NextFunction) => {
  const workRequest: WorkCreateRequest = WorkCreateSchema.parse(req.body);

  const existingWork = await db.work.findFirst({
    where: {
      authorId: req.user.id,
      title: workRequest.title,
    },
  });

  if (existingWork)
    return throwError(
      `Work with title ${workRequest.title} already exists`,
      StatusCodes.CONFLICT,
      next
    );

  const { id, ...newWork } = await db.work.create({
    data: {
      title: workRequest.title,
      description: workRequest.description || EMPTY_STRING,
      period: workRequest.period,
      authorId: req.user.id,
      partyId: workRequest.partyId,
      workItem: {
        create: {
          userId: req.user.id,
          access: Access.OWNER,
        },
      },
    },
  });

  logger.info(`Successfully created Work ${JSON.stringify(newWork)}`);
  res.status(StatusCodes.OK).send(newWork);
};

const editWork = async (req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.OK).send({});
};

const deleteWork = async (req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.OK).send({});
};

const getWorks = async (req: Request, res: Response, next: NextFunction) => {
  const usersWorkItems = await db.workItem.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      work: true,
    },
  });
  res.status(200).json(usersWorkItems);
};

export { createWork, getWorks, editWork, deleteWork };
