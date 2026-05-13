import express from "express";
import { handlerReadiness } from "./api/readiness";
import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware";
import { handlerMetrics } from "./api/metrics";
import { handlerReset } from "./api/reset";
import { handlerChirp } from "./api/validate_chirp";

const app = express();
const PORT = 8080;

app.use(express.json())
app.use(middlewareLogResponses);
app.post("/admin/reset", handlerReset);
app.post("/api/validate_chirp", handlerChirp)
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.use("/app",middlewareMetricsInc, express.static("./src/app"));


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});