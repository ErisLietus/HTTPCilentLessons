"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const readiness_1 = require("./api/readiness");
const middleware_1 = require("./api/middleware");
const metrics_1 = require("./api/metrics");
const reset_1 = require("./api/reset");
const validate_chirp_1 = require("./api/validate_chirp");
const app = (0, express_1.default)();
const PORT = 8080;
app.use(express_1.default.json());
app.use(middleware_1.middlewareLogResponses);
app.post("/admin/reset", reset_1.handlerReset);
app.post("/api/validate_chirp", validate_chirp_1.handlerChirp);
app.get("/api/healthz", readiness_1.handlerReadiness);
app.get("/admin/metrics", metrics_1.handlerMetrics);
app.use("/app", middleware_1.middlewareMetricsInc, express_1.default.static("./src/app"));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
