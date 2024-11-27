import {
  currentUser,
  errorHandler,
  logger,
  NotFoundError,
  requireAuth,
} from "@krezona/common-library";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import express, { Request } from "express";
import "express-async-errors";
import geoIp from "geoip-lite";
import UAParser from "ua-parser-js";

import cors from "cors";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://localhost:3004",
      "http://localhost:3005",
      "http://localhost:3006",
      "http://localhost:3007",
      "http://localhost:3008",
      "http://localhost:3009",
      "http://192.168.1.65:3007",
    ],
    credentials: true,
  })
);
app.set("trust proxy", true);
app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === "production" ? true : false,
    httpOnly: true,
    // sameSite: (process.env.NODE_ENV  === 'production') ? 'strict': 'none',
    sameSite: "strict",
  })
);

// app.use(passport.initialize());
// app.use(passport.session());

// Middleware to log each request
app.use((req, res, next) => {
  console.log(req.headers);
  console.log(req.session);
  const userAgent = req.headers["user-agent"];
  const ipAddress = req.ip || req.socket.remoteAddress;
  console.log(ipAddress!);
  const geolocation = geoIp.lookup(ipAddress!);
  console.log(geolocation);
  console.log("Raw User-Agent:", userAgent);

  const parser = new UAParser();
  const parsedUserAgent = parser.setUA(userAgent!).getResult();

  // Log parsed details
  console.log("Parsed User-Agent:", parsedUserAgent);
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get("/api/users/hi", (req, res) => {
  res.send("hello there from free route");
});

//keep routes that have no need for protection

app.use(currentUser);
//protected routes

app.use(errorHandler);

import http from "http";
import { Server as WebSocketServer } from "ws";

console.log(typeof app);
logger.info(typeof app);

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/chatApi" });

wss.on("connection", async (ws, req: Request) => {
  const urlParts = req.url?.split("?");
  const queryParams = new URLSearchParams(urlParts[1] || "");

  try {
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());

        // Handle different types of messages
        console.log(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    ws.on("close", (code, reason) => {
      console.log(`WebSocket closed with code ${code} and reason: ${reason}`);
    });

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  } catch (error) { }
});

app.get("/api/users/authenticated/hi", requireAuth, (req, res) => {
  res.send("hello there from protected route");
});

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

export { app, server };
