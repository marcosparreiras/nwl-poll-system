import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
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

      if (!poll) {
        return reply.status(400).send({ message: "poll not found" });
      }

      const result = await redis.zrange(poll.id, 0, -1, "WITHSCORES");
      const votes = result.reduce<Record<string, number>>((acc, cur, index) => {
        if (index % 2 == 0) {
          acc[cur] = Number(result[index + 1]);
        }
        return acc;
      }, {});

      return reply.status(200).send({
        poll: {
          id: poll.id,
          title: poll.title,
          options: poll.options.map((option) => {
            return {
              id: option.id,
              title: option.title,
              score: votes[option.id] ?? 0,
            };
          }),
        },
      });
    }
  );
}
