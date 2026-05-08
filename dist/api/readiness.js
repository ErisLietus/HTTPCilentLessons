"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerReadiness = handlerReadiness;
async function handlerReadiness(req, res) {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
}
