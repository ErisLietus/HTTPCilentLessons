import { makeRefreshToken } from "../../auth.js";
import { db } from "../indexDB.js";
import { NewRefreshToken, refreshTokens, users } from "../schema.js";
import { and, eq, gt, isNull } from "drizzle-orm";

export async function createRefreshToken(token: string, id: string){
    const sixtyDays = 1000 * 60 * 60 * 24 * 60;
    const expiresAt = new Date(Date.now() + sixtyDays);

    const refreshToken: NewRefreshToken = {
        userId: id, 
        expiresAt: expiresAt,
        token: token
    } 

    const [result] = await db
        .insert(refreshTokens)
        .values(refreshToken)
        .returning();
      return result;
}



export async function getUserFromRefreshToken(token: string) {
  const result = await db
    .select({ id: users.id})
    .from(users)
    .innerJoin(refreshTokens, eq(refreshTokens.userId, users.id))
    .where(
      and(
        eq(refreshTokens.token, token),
        gt(refreshTokens.expiresAt, new Date()),
        isNull(refreshTokens.revokedAt),
      ),
    );
  return result[0];
}

export async function revokeRefreshToken(token:string) {
    await db
  .update(refreshTokens)
  .set({ revokedAt: new Date(), updatedAt: new Date() })
  .where(eq(refreshTokens.token, token));
}