import { WebSocketServer } from "ws";
import { EventEmitter } from "events";
import { RESPONSE_CODE, RESPONSE_MESSAGE } from "./constants.js";

import type { Server } from "http";

const HEARTBEAT_INTERVAL = 1000 * 5;

export const ee = new EventEmitter();
ee.setMaxListeners(Infinity);

export const wssConfigure = (server: Server) => {
    const wss = new WebSocketServer({ server, path: "/wss" });

    var pingInt = setInterval(() => {
        ee.emit("ping");
    }, HEARTBEAT_INTERVAL);

    wss.on("connection", async (ws, req) => {
        const cookies = req.headers.cookie?.split("; ");
        const userId = cookies?.find((c) => c.startsWith("userId"))?.split("=")[1];
        if (!userId) return ws.close(RESPONSE_CODE.UNAUTHORIZED, RESPONSE_MESSAGE.UNAUTHORIZED);

        let timeoutId: Timer;

        const resetTimeout = () => {
            if (timeoutId) clearTimeout(timeoutId);

            let temp = setTimeout(() => {
                if (temp == timeoutId) ws.terminate();
            }, 1000 * 20);

            timeoutId = temp;
        };

        ws.on("message", () => resetTimeout());

        ws.once("close", () => clearTimeout(timeoutId));

        resetTimeout();
    });

    wss.on("close", () => clearInterval(pingInt));

    console.log("WebSocket server configured");
    return wss;
};
