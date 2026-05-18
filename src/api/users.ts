import type { Request, Response } from "express";
import { BadRequestError } from "./error.js";
import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { db } from "../db/indexDB.js";

type parameters = { email: string};

export async function handlerUsersCreate(req: Request, res: Response) {
  
  const params: parameters = req.body
  if(!params.email){
    throw new BadRequestError("No input given")
  }
  const user = await createUser(params)
  respondWithJSON(res, 201, {
  id: user.id,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
}

