import cors from "cors";
import express from "express";
import passport from "passport";
import router from "./routes/api.js";
import session from "express-session";
import { init, close } from "./core.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { requestLogger } from "./middlewares/logger/loggers.js";
import { IS_PROD, BASE_PATH, CLIENT_URL, PORT, SESSION_SECRET } from "./constants.js";

const app = express();

app.use(
    cors({
        origin: [CLIENT_URL, "http://localhost:5018"],
        credentials: true,
    })
);

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: IS_PROD,
            httpOnly: true,
            sameSite: IS_PROD ? "none" : "lax",
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(BASE_PATH, router);
app.use(errorHandler);

await init();

app.on("close", async () => {
    await close();
});

app.listen(PORT, async () => {
    console.log(`\nServer is running on port ${PORT}`);
});

process.once("SIGINT", () => {
    app.emit("close");
});

process.once("SIGTERM", () => {
    app.emit("close");
});
