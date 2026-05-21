import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "./error.js";
import { createChirp, deleteChirp, getAChirp } from "../db/queries/chirps.js";
import { getChirps } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { error } from "node:console";


export type chirp = {
    userId: string,
    body: string,
}

export async function handlerChirp(req: Request, res: Response) {
    const parsed: chirp = req.body;

    if (parsed.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140")
    }
    const lst = parsed.body.split(" ")
    const cleanList = []
    for (let word of lst){
        if(word.toLowerCase() === "kerfuffle" || word.toLowerCase() === "sharbert" || word.toLowerCase() === "fornax"){
            word = "****"
            cleanList.push(word)
        }else {
        cleanList.push(word)
    }
    }
    const token = getBearerToken(req)
    const user = validateJWT(token, config.jwt.key)
    
    const newChirp = await createChirp({
        body: cleanList.join(" "),
        userId: user

    })
    

    return respondWithJSON(res, 201, newChirp);
}

export async function allChirps(req: Request, res : Response) {
    const chirps = await getChirps()
     respondWithJSON(res, 200, chirps)
}   

export async function singleChirp(req: Request, res: Response) {
    const id = req.params.chirpId as string
   try {

    const chirp = await getAChirp(id)
    respondWithJSON(res, 200, chirp)
   }catch(err){
    respondWithError(res, 404, "no chirp found")
   }
}

export async function handlerDeleteChirp(req: Request, res: Response){
    const chirpId = req.params.chirpId;
    const token = getBearerToken(req)

    const user = validateJWT(token, config.jwt.key)
    if(typeof chirpId !== "string"){
        throw new BadRequestError("Invalid chirp ID")
    }
    const sendChirp = await getAChirp(chirpId)
    
    if (user !== sendChirp.userId){
        throw new ForbiddenError("Cannot delete chirp not sent by the user")
    }

    const deleted = await deleteChirp(chirpId)
    if(!deleted){
        throw new Error("Error chirp was not deleted")
    }

    res.status(204).send()
}