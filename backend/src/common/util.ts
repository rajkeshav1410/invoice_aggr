import { NextFunction } from "express";

const throwError = (
  message: string,
  statusCode: number,
  next: NextFunction
) => {
  return next({ message, statusCode });
};

const cleanAlphanumericSort = (a: string, b: string) => {
  // Remove non-alphanumeric characters from strings for comparison
  const cleanA = a.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  const cleanB = b.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  // Compare the cleaned strings
  return cleanA.localeCompare(cleanB);
};

export { throwError, cleanAlphanumericSort };
