"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const readiness_1 = require("./api/readiness");
const middleware_1 = require("./api/middleware");
const app = (0, express_1.default)();
const PORT = 8080;
app.use(middleware_1.middlewareLogResponses);
app.get("/healthz", readiness_1.handlerReadiness);
app.use("/app", express_1.default.static("./src/app"));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
