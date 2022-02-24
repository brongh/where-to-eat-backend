import { Request, Response, NextFunction } from "express";
import { CustomError } from "../models/custom-error";

function handleError(
  err: CustomError | TypeError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let customError = err;

  if (!(err instanceof CustomError)) {
    customError = new CustomError("Big bad error");
  }

  res.status((customError as CustomError).status).send(customError);
}

export default handleError;
