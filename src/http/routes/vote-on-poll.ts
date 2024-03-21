import { randomUUID } from "node:crypto";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";

export async function voteOnPoll(app: FastifyInstance) {
  app.post(
    "/polls/:pollId/votes",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const requestParamsSchema = z.object({
        pollId: z.string().uuid(),
      });

      const requestBodySchema = z.object({
        pollOptionId: z.string().uuid(),
      });

      const { pollId } = requestParamsSchema.parse(request.params);
      const { pollOptionId } = requestBodySchema.parse(request.body);

      let { sessionId } = request.cookies;

      if (sessionId) {
        const userPreviousVoteOnPoll = await prisma.vote.findUnique({
          where: { sessionId_pollId: { sessionId, pollId } },
        });

        if (
          userPreviousVoteOnPoll &&
          userPreviousVoteOnPoll.pollOptionId !== pollOptionId
        ) {
          await prisma.vote.delete({
            where: { id: userPreviousVoteOnPoll.id },
          });
          await redis.zincrby(pollId, -1, userPreviousVoteOnPoll.pollOptionId);
        } else if (userPreviousVoteOnPoll) {
          return reply
            .status(400)
            .send({ message: "You already voted on this option" });
        }
      }

      if (!sessionId) {
        sessionId = randomUUID();
        reply.setCookie("sessionId", sessionId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          signed: true,
          httpOnly: true,
        });
      }

      await prisma.vote.create({ data: { sessionId, pollId, pollOptionId } });
      await redis.zincrby(pollId, 1, pollOptionId);

      return reply.status(201).send();
    }
  );
}
