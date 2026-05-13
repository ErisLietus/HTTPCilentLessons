import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json";

type chirp = {
    body: string,
}

export async function handlerChirp(req: Request, res: Response) {
    // The middleware already parsed the body into req.body
    const parsed: chirp = req.body;

    // We can now access parsed.body immediately
    if (parsed.body.length > 140) {
        return respondWithError(res, 400, "Chirp is too long");
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
