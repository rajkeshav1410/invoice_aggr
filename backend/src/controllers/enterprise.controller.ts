import { NextFunction, Request, Response } from "express";
import withErrorHandling from "../middlewares/handleAsync";
import prisma from "../common/database";
import { StatusCodes } from "http-status-codes";
import { EnterpriseCreateRequest, EnterpriseCreateSchema } from "../models/enterprise.model";

const createEnterprise = withErrorHandling(
  async (req: Request, res: Response, next: NextFunction) => {
    const enterpriseRequest: EnterpriseCreateRequest = EnterpriseCreateSchema.parse(req.body);
    const existingEnterprise = await prisma.enterprise.findFirst({
      where: {
        gstin: enterpriseRequest.gstin,
        userId: req.user.id,
      },
    });
    if (existingEnterprise)
      return next({
        message: `Enterprise with GSTIN ${existingEnterprise.gstin} already exists`,
        statusCode: StatusCodes.CONFLICT,
      });

    const { id, ...newEnterprise } = await prisma.enterprise.create({
      data: {
        name: enterpriseRequest.name,
        address: enterpriseRequest.address,
        gstin: enterpriseRequest.gstin,
        userId: req.user.id,
      },
    });

    res.status(StatusCodes.OK).json(newEnterprise);
  }
);

export { createEnterprise };
