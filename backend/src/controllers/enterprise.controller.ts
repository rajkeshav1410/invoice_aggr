import { NextFunction, Request, Response } from "express";
import { Enterprise } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import db from "../common/database";
import logger from "../common/logger";
import { cleanAlphanumericSort, throwError } from "../common/util";
import {
  EnterpriseCreateRequest,
  EnterpriseCreateSchema,
  EnterpriseEditRequest,
  EnterpriseEditScema,
  EnterpriseResponse,
} from "../models/enterprise.model";

const createEnterprise = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const enterpriseRequest: EnterpriseCreateRequest =
    EnterpriseCreateSchema.parse(req.body);

  const existingEnterprise = await db.enterprise.findFirst({
    where: {
      gstin: enterpriseRequest.gstin,
      userId: req.user.id,
    },
  });

  if (existingEnterprise)
    return throwError(
      `Enterprise with GSTIN ${existingEnterprise.gstin} already exists`,
      StatusCodes.CONFLICT,
      next
    );

  const { id, ...newEnterprise } = await db.enterprise.create({
    data: {
      name: enterpriseRequest.name.trim(),
      address: enterpriseRequest.address.trim(),
      gstin: enterpriseRequest.gstin,
      userId: req.user.id,
    },
  });

  logger.info(
    `Successfully created Enterprise ${JSON.stringify(newEnterprise)}`
  );

  res.status(StatusCodes.OK).json(newEnterprise);
};

const editEnterprise = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const enterpriseRequest: EnterpriseEditRequest = EnterpriseEditScema.parse(
    req.body
  );

  const existingEnterprise = await db.enterprise.findFirst({
    where: {
      gstin: enterpriseRequest.gstin,
      userId: req.user.id,
    },
  });

  if (!existingEnterprise)
    return throwError(
      `No enterprise found with gstin: ${enterpriseRequest.gstin}`,
      StatusCodes.BAD_REQUEST,
      next
    );

  const { id, ...updatedEnterprise } = await db.enterprise.update({
    where: {
      id: existingEnterprise.id,
    },
    data: {
      name: enterpriseRequest.name?.trim() || existingEnterprise.name,
      address: enterpriseRequest.address?.trim() || existingEnterprise.address,
    },
  });

  logger.info(
    `Successfully updated Enterprise ${JSON.stringify(updatedEnterprise)}`
  );

  res.status(StatusCodes.OK).json(updatedEnterprise);
};

const getEnterprises = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [enterprises, usersEnterprise] = await db.$transaction([
    db.enterprise.findMany({
      distinct: ["name", "address", "gstin"],
    }),
    db.enterprise.findMany({
      where: {
        userId: req.user.id,
      },
    }),
  ]);
  const usersGstinMap: { [gstin: string]: Enterprise } = {};
  usersEnterprise.forEach(
    (enterprise) => (usersGstinMap[enterprise.gstin] = enterprise)
  );

  const enterpriseList = enterprises
    .sort((a, b) => cleanAlphanumericSort(a.name, b.name))
    .map(
      (enterprise) =>
      ({
          enterpriseId: enterprise.id,
          name: enterprise.name,
          address: enterprise.address,
          gstin: enterprise.gstin,
          isCreator: usersGstinMap[enterprise.gstin] !== undefined,
        } as EnterpriseResponse)
    );

  logger.info(`Fetched all enterprise`);
  res.status(StatusCodes.OK).json(enterpriseList);
};

const deleteEnterprise = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const enterpriseRequest: EnterpriseEditRequest = EnterpriseEditScema.parse(
    req.body
  );

  const existingEnterprise = await db.enterprise.findFirst({
    where: {
      gstin: enterpriseRequest.gstin,
      userId: req.user.id,
    },
  });

  if (!existingEnterprise)
    return throwError(
      `No enterprise found with gstin: ${enterpriseRequest.gstin}`,
      StatusCodes.BAD_REQUEST,
      next
    );

  const deletedEnterprise = await db.enterprise.delete({
    where: {
      id: existingEnterprise.id,
    },
  });

  logger.info(
    `Successfully deleted Enterprise ${JSON.stringify(deletedEnterprise)}`
  );

  res.status(StatusCodes.OK).json(deletedEnterprise);
};

export { createEnterprise, editEnterprise, getEnterprises, deleteEnterprise as removeEnterprise };
