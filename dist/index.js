import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerChirp } from "./api/validate_chirp.js";
import { errorHandler } from "./api/error.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerUsersCreate } from "./api/users.js";
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(middlewareLogResponses);
app.post("/admin/reset", handlerReset);
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.post("/api/validate_chirp", (req, res, next) => {
    Promise.resolve(handlerChirp(req, res)).catch(next);
});
app.post("/api/users", (req, res, next) => {
    Promise.resolve(handlerUsersCreate(req, res)).catch(next);
});
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
