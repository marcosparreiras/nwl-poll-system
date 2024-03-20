import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function createPoll(app: FastifyInstance) {
  app.post("/polls", async (request: FastifyRequest, reply: FastifyReply) => {
    const requestBodySchema = z.object({
      title: z.string(),
    });

    const { title } = requestBodySchema.parse(request.body);
    const poll = await prisma.poll.create({ data: { title } });
    return reply.status(201).send(poll);
  });
}
