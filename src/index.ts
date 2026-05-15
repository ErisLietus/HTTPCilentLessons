import express from "express";
import { handlerReadiness } from "./api/readiness";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware";
import { handlerMetrics } from "./api/metrics";
import { handlerReset } from "./api/reset";
import { handlerChirp } from "./api/validate_chirp";
import { errorHandler } from "./api/error";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;

app.use(express.json())
app.use(middlewareLogResponses);
app.post("/admin/reset", handlerReset);
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.use("/app",middlewareMetricsInc, express.static("./src/app"));
app.post("/api/validate_chirp", (req, res, next) => {
  Promise.resolve(handlerChirp(req, res)).catch(next);
})
app.use(errorHandler)


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});