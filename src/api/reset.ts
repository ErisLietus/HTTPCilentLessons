import { Request, Response } from "express";
import { config } from "../config";

export async function handlerReset(req: Request,  res:Response): Promise<void>{
    config.fileserverHits = 0;
    res.status(200).end()
}