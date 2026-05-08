import { Request, Response } from "express";
import { config } from "../config";

export async function handlerMetrics(req: Request,  res:Response): Promise<void>{
    res.set("Content-Type", "text/plain; charset=utf-8")
    res.send(`Hits: ${config.fileserverHits}`)
}