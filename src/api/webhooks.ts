import { Request, Response } from "express";
import { upgradeToChirpRed } from "../db/queries/users.js";
import { NotFoundError, UnauthorizedError } from "./error.js";
import { getAPIKey } from "../auth.js";
import { config } from "../config.js";

type webhooks = { event: string, data:{ userId: string} }

export async function handlerChirpyRedUpgrade(req: Request, res: Response) {
    const params: webhooks = req.body
    const key = getAPIKey(req)

    if(key !== config.api.p_key){
        throw new UnauthorizedError("Key does not match")
    }
    if(params.event !== "user.upgraded"){
        res.status(204).send("OK");
    }else{
        const userUpgrade = await upgradeToChirpRed(params.data.userId)
        if(!userUpgrade){
            throw new NotFoundError("User not found")
        }else {
            res.status(204).end()
        }
    }
}