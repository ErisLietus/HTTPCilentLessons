import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerChirp, handlerDeleteChirp, singleChirp } from "./api/chirps.js";
import { errorHandler } from "./api/error.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerUsersCreate, handlerUsersUpdate } from "./api/users.js";
import { allChirps } from "./api/chirps.js";
import { loginHandler } from "./api/login.js";
import { refreshHandler, revokeHandler } from "./api/refresh.js";
import { handlerChirpyRedUpgrade } from "./api/webhooks.js";
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(middlewareLogResponses);
app.post("/admin/reset", handlerReset);
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.get("/api/chirps/:chirpId", (req, res, next) => {
    Promise.resolve(singleChirp(req, res)).catch(next);
});
app.get("/api/chirps", (req, res, next) => {
    Promise.resolve(allChirps(req, res)).catch(next);
});
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.post("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerChirp(req, res)).catch(next);
});
app.post("/api/users", (req, res, next) => {
    Promise.resolve(handlerUsersCreate(req, res)).catch(next);
});
app.post("/api/login", (req, res, next) => {
    Promise.resolve(loginHandler(req, res)).catch(next);
});
app.post("/api/refresh", (req, res, next) => {
    Promise.resolve(refreshHandler(req, res)).catch(next);
});
app.post("/api/revoke", (req, res, next) => {
    Promise.resolve(revokeHandler(req, res)).catch(next);
});
app.put("/api/users", (req, res, next) => {
    Promise.resolve(handlerUsersUpdate(req, res)).catch(next);
});
app.delete("/api/chirps/:chirpId", (req, res, next) => {
    Promise.resolve(handlerDeleteChirp(req, res)).catch(next);
});
app.post("/api/polka/webhooks", (req, res, next) => {
    Promise.resolve(handlerChirpyRedUpgrade(req, res)).catch(next);
});
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
