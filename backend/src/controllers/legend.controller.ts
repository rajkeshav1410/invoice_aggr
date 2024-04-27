import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import db from "../common/database";
import { EMPTY_STRING } from "../common/constants";
import { throwError } from "../common/util";
import logger from "../common/logger";
import {
  LegendCreateSchema,
  LegendCreateRequest,
  LegendListSchema,
  LegendEditSchema,
} from "../models/legend.model";
import { StatusCodes } from "http-status-codes";

const createLegend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const legendRequest: LegendCreateRequest = LegendCreateSchema.parse(req.body);

  const [existingWork, existingEnterprise] = await db.$transaction([
    db.work.findFirst({
      where: {
        id: legendRequest.workId,
      },
    }),
    db.enterprise.findFirst({
      where: {
        id: legendRequest.enterpriseId,
      },
    }),
  ]);

  if (!existingWork)
    return throwError(
      `Work with id ${legendRequest.workId} does not exist`,
      StatusCodes.BAD_REQUEST,
      next
    );

  if (!existingEnterprise)
    return throwError(
      `Enterprise with id ${legendRequest.enterpriseId} does not exist`,
      StatusCodes.BAD_REQUEST,
      next
    );

  const existingLegend = await db.legend.findFirst({
    where: {
      workId: legendRequest.workId,
      enterpriseId: legendRequest.enterpriseId,
      invoice: legendRequest.invoice,
    },
    include: {
      enterprise: true,
    },
  });

  if (existingLegend)
    return throwError(
      `Legend for ${existingLegend.enterprise.name} with invoice ${legendRequest.invoice} already exists`,
      StatusCodes.CONFLICT,
      next
    );

  const { id, ...newLegend } = await db.legend.create({
    data: {
      workId: legendRequest.workId,
      enterpriseId: legendRequest.enterpriseId,
      invoice: legendRequest.invoice,
      invoiceDate: legendRequest.invoiceDate,
      purchase: {
        p18: legendRequest.p18,
        p12: legendRequest.p12,
        p5: legendRequest.p5,
        p0: legendRequest.p0,
      },
    },
  });

  logger.info(`Successfully created Legend ${JSON.stringify(newLegend)}`);
  res.status(StatusCodes.OK).send(newLegend);
};

const editLegend = async (req: Request, res: Response, next: NextFunction) => {
  const legendEditRequest = LegendEditSchema.parse(req.body);

  const existingLegend = await db.legend.findFirst({
    where: {
      id: legendEditRequest.legendId,
    },
  });

  if (!existingLegend)
    return throwError(
      `Legend with id ${legendEditRequest.legendId} does not exist`,
      StatusCodes.BAD_REQUEST,
      next
    );

  const similarLegend = await db.legend.findFirst({
    where: {
      workId: existingLegend.workId,
      enterpriseId: legendEditRequest.enterpriseId,
      invoice: legendEditRequest.invoice,
      NOT: {
        id: legendEditRequest.legendId,
      },
    },
    include: {
      enterprise: true,
    },
  });

  if (
    legendEditRequest.enterpriseId &&
    legendEditRequest.invoice &&
    similarLegend
  )
    return throwError(
      `Legend for ${similarLegend.enterprise.name} with invoice ${similarLegend.invoice} already exists`,
      StatusCodes.BAD_REQUEST,
      next
    );

  const { id, ...updatedLegend } = await db.legend.update({
    where: {
      id: legendEditRequest.legendId,
    },
    data: {
      enterpriseId:
        legendEditRequest.enterpriseId?.trim() || existingLegend.enterpriseId,
      invoice: legendEditRequest.invoice?.trim() || existingLegend.invoice,
      invoiceDate: legendEditRequest.invoiceDate || existingLegend.invoiceDate,
      purchase: {
        p18: legendEditRequest.p18 || existingLegend.purchase.p18,
        p12: legendEditRequest.p12 || existingLegend.purchase.p12,
        p5: legendEditRequest.p5 || existingLegend.purchase.p5,
        p0: legendEditRequest.p0 || existingLegend.purchase.p0,
      },
    },
  });

  logger.info(
    `Updated legend ${legendEditRequest.legendId} ${JSON.stringify(
      updatedLegend
    )}`
  );
  res.status(StatusCodes.OK).send(updatedLegend);
};

const deleteLegend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(StatusCodes.OK).send({});
};

const getLegends = async (req: Request, res: Response, next: NextFunction) => {
  const legendListRequest = LegendListSchema.parse(req.body);

  const legendFilters: Prisma.LegendWhereInput = {};

  // Check if workId is defined
  if (
    legendListRequest.workId !== undefined &&
    legendListRequest.workId.trim() !== EMPTY_STRING
  ) {
    legendFilters.workId = legendListRequest.workId;
  }

  // Check if enterpriseId is defined
  if (
    legendListRequest.enterpriseId !== undefined &&
    legendListRequest.enterpriseId.trim() !== EMPTY_STRING
  ) {
    legendFilters.enterpriseId = legendListRequest.enterpriseId;
  }

  // Check if invoice is defined
  if (
    legendListRequest.invoice !== undefined &&
    legendListRequest.invoice.trim() !== EMPTY_STRING
  ) {
    legendFilters.invoice = legendListRequest.invoice;
  }

  // Check if invoiceDate is defined
  if (legendListRequest.invoiceDate !== undefined) {
    legendFilters.invoiceDate = legendListRequest.invoiceDate;
  }

  // If none of the filters are defined, filter by current user's legends
  if (
    Object.keys(legendFilters).length === 0 &&
    legendFilters.constructor === Object
  ) {
    legendFilters.Work = {
      authorId: req.user.id,
    };
  }

  const usersLegendItems = await db.legend.findMany({
    where: legendFilters,
  });
  res.status(200).json(usersLegendItems);
};

export { createLegend, getLegends, editLegend, deleteLegend };
