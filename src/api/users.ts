import type { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "./error.js";
import { createUser, updateUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import {  getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { config } from "../config.js";


type parameters = { password: string, email: string };
type CreateUserParams = { email: string, hashedPassword: string }

export async function handlerUsersCreate(req: Request, res: Response) {

  const params: parameters = req.body
  if (!params.email || !params.password) {
    throw new BadRequestError("Email or password missing.")
  }
  const hashedPassword = await hashPassword(params.password);
  const userParams: CreateUserParams = {
    email: params.email,
    hashedPassword: hashedPassword 
  };
  const user = await createUser(userParams)
  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isChirpyRed: user.isChirpyRed
  });
}

export async function handlerUsersUpdate(req: Request, res: Response) {
    const token = getBearerToken(req)
    const user = validateJWT(token, config.jwt.key)

    const param: parameters = req.body
    if(!param.email || !param.password){
      throw new BadRequestError("Missing Email or Password")
    }

    const hash = await hashPassword(param.password)
    const updatedUser = await updateUser(user, param.email, hash)

    respondWithJSON(res, 200, {
      id: user,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      isChirpyRed: updatedUser.isChirpyRed
    })
}

