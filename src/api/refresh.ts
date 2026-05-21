import { Request, Response } from "express";
import { getUserFromRefreshToken, revokeRefreshToken } from "../db/queries/refresh.js";
import { UnauthorizedError } from "./error.js";
import { makeJWT } from "../auth.js";
import { config } from "../config.js";
import { respondWithJSON } from "./json.js";
import { getBearerToken } from "../auth.js";



export async function refreshHandler(req: Request, res: Response){
    const token = getBearerToken(req)
    const user = await getUserFromRefreshToken(token)

    if(user === undefined){
        throw new UnauthorizedError("An Error has occured")
    }else{
        const jwttoken = makeJWT(user.id, 60* 60 , config.jwt.key)
        respondWithJSON(res, 200, {token: jwttoken})
    }
}

export async function revokeHandler(req: Request, res: Response){
    const token = getBearerToken(req)
    await revokeRefreshToken(token)

    res.status(204).send()


}