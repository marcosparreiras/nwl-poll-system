import fastify from "fastify";
import { createPoll } from "./routes/create-poll";
import { getPoll } from "./routes/get-poll";

const app = fastify();

app.register(createPoll);
app.register(getPoll);

const PORT = 3333;
app.listen({ port: PORT }).then(() => {
  console.log(`Server is running on port ${PORT}`);
});
