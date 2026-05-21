import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./api/error.js";
import { Request } from "express";
import { randomBytes } from "node:crypto";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;


export async function hashPassword(userPassword: string): Promise<string>{
    return await argon2.hash(userPassword)
    
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean>{
    return await argon2.verify(hash, password)

}

export function makeJWT(userID: string, expiresIn: number, secret: string): string{
   const issuedAt = Math.floor(Date.now() / 1000)
   const expiresAt = issuedAt + expiresIn

   const payload: payload ={
    iss: "chirpy", 
    sub: userID, 
    iat: issuedAt,
    exp: expiresAt
   } 
   return jwt.sign(payload, secret)

}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const token = jwt.verify(tokenString, secret)

        if (typeof token === "string") {
            throw new UnauthorizedError("jwt Error")
        }

        if (!token.sub || typeof token.sub !== "string") {
            throw new UnauthorizedError("jwt Error")
        }

        return token.sub
    } catch {
        throw new UnauthorizedError("jwt Error")
    }
}

export function getBearerToken(req: Request): string{
    const auth = req.get("Authorization")
    if(typeof auth !== "string"){
        throw new UnauthorizedError("An Error occurred")
    }
    return auth.replace("Bearer ", "").trim()
}

export function makeRefreshToken(){
    return randomBytes(32).toString("hex")
}

export function getAPIKey(req: Request): string{
    const auth = req.get("Authorization")
    if(typeof auth !== "string"){
        throw new UnauthorizedError("An Error occurred")
    }
    return auth.replace("ApiKey ", "").trim()
}