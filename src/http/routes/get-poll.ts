import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import z from "zod";

export async function getPoll(app: FastifyInstance) {
  app.get(
    "/polls/:pollId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const requestParamsSchema = z.object({
        pollId: z.string().uuid(),
      });

      const { pollId } = requestParamsSchema.parse(request.params);

      const poll = await prisma.poll.findUnique({
        where: { id: pollId },
        include: { options: { select: { id: true, title: true } } },
      });

      if (poll) {
        return reply.status(200).send({ poll });
      }

      return reply.status(400).send({ message: "poll not found" });
    }
  );
}
