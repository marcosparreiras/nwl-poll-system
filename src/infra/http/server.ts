import fastify from "fastify";
import websocket from "@fastify/websocket";
import cookie from "@fastify/cookie";
import { createPoll } from "./routes/create-poll";
import { getPoll } from "./routes/get-poll";
import { voteOnPoll } from "./routes/vote-on-poll";
import { pollResults } from "./ws/poll-results";

const app = fastify();

app.register(websocket);
app.register(cookie, {
  secret: "poll-app-secret",
  hook: "onRequest",
});

app.register(createPoll);
app.register(getPoll);
app.register(voteOnPoll);

app.register(pollResults);

const PORT = 3333;
app.listen({ port: PORT }).then(() => {
  console.log(`Server is running on port ${PORT}`);
});
