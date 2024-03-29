import fastify from "fastify";
import websocket from "@fastify/websocket";
import cookie from "@fastify/cookie";
import { env } from "../env";
import { pollRoutes } from "./routes/poll-routes";

const app = fastify();

app.register(websocket);
app.register(cookie, {
  secret: "poll-app-secret",
  hook: "onRequest",
});

app.register(pollRoutes);

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server is running on port ${env.PORT}`);
});
