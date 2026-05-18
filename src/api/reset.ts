import { Request, Response } from "express";
import { config } from "../config.js";
import { ForbiddenError } from "./error.js";
import { db } from "../db/indexDB.js";
import { reset } from "../db/queries/users.js";

export async function handlerReset(req: Request, res: Response) {
  if (config.api.platform !== "dev") {
    res.status(403).send("Forbidden");
    return;
  }
  config.api.fileserverHits = 0;
  await reset();
  res.status(200).send("OK");
}