import fastify from "fastify";
import { createPoll } from "./routes/create-poll";

const app = fastify();

app.register(createPoll);

const PORT = 3333;
app.listen({ port: PORT }).then(() => {
  console.log(`Server is running on port ${PORT}`);
});
