import { Request, Response } from "express";
import { UnauthorizedError } from "./error.js";
import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../auth.js";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";
import { createRefreshToken } from "../db/queries/refresh.js";

type parameters = {email: string, password: string}

export async function loginHandler(req: Request, res: Response){
    const input: parameters = req.body

    if(!input.email || !input.password){
        throw new UnauthorizedError("incorrect email or password")
    }

    const user = await getUserByEmail(input.email)
    if(!user){
        throw new UnauthorizedError("incorrect email or password")
    }

    if(!await checkPasswordHash(input.password, user.hashedPassword)){
        throw new UnauthorizedError("incorrect email or password")
    }

        const jwtToken = makeJWT(user.id, 60*60, config.jwt.key)
        const refreshToken = makeRefreshToken()
        await createRefreshToken(refreshToken, user.id)

        respondWithJSON(res, 200, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token: jwtToken,
        refreshToken: refreshToken,
        isChirpyRed: user.isChirpyRed
      });

    }
