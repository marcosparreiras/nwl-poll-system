import fastify from "fastify";
import websocket from "@fastify/websocket";
import cookie from "@fastify/cookie";
import { pollRoutes } from "./routes/poll-routes";

export const app = fastify();

app.register(websocket);
app.register(cookie, {
  secret: "poll-app-secret",
  hook: "onRequest",
});

app.register(pollRoutes);
