import { asc, desc } from "drizzle-orm";
import { respondWithJSON } from "../../api/json.js";
import { db } from "../indexDB.js";
import { NewChirp, chirps } from "../schema.js";
import { Response, Request } from "express";
import { chirp } from "../../api/chirps.js";
import { eq, and } from "drizzle-orm";
import { NotFoundError } from "../../api/error.js";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .returning();
    return result;
}

export async function getChirps(id?: string, order?: string) {
    let ordering = asc
    if(order === "desc"){
        ordering = desc
    }
    if (id) {
        const results = await db.select().from(chirps).where(eq(chirps.userId, id)).orderBy(ordering(chirps.createdAt))
        return results
    } else {
        const results = await db.select().from(chirps).orderBy(ordering(chirps.createdAt))
        return results
    }

}


export async function getAChirp(id: string) {
    const results = await db.select().from(chirps).where(eq(chirps.id, id))
    if (results.length === 0) {
        throw new NotFoundError("No chirp Found")
    }
    return results[0]
}

export async function deleteChirp(chirpId: string) {
    const results = await db.delete(chirps).where(eq(chirps.id, chirpId)).returning();
    return results.length > 0
}

