import fastify from "fastify";

const app = fastify();

app.get("/", (_request, reply) => {
  return reply.status(200).send("Hello world");
});

const PORT = 3333;
app.listen({ port: PORT }).then(() => {
  console.log(`Server is running on port ${PORT}`);
});
