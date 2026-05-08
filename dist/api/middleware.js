"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewareLogResponses = middlewareLogResponses;
exports.middlewareMetricsInc = middlewareMetricsInc;
const config_1 = require("../config");
function middlewareLogResponses(req, res, next) {
    res.on("finish", () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
}
function middlewareMetricsInc(req, res, next) {
    config_1.config.fileserverHits++;
    next();
}
