import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequestError } from "./error.js";

type chirp = {
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

    return respondWithJSON(res, 200, { "cleanedBody": cleanList.join(" ") } );
}
