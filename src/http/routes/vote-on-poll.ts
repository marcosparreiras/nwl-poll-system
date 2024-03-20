import { randomUUID } from "node:crypto";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function voteOnPoll(app: FastifyInstance) {
  app.post(
    "/polls/:pollId/votes",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const requestParamsSchema = z.object({
        pollId: z.string().uuid(),
      });

      const requestBodySchema = z.object({
        optionId: z.string().uuid(),
      });

      const { pollId } = requestParamsSchema.parse(request.params);
      const { optionId } = requestBodySchema.parse(request.body);

      let { sessionId } = request.cookies;
      if (!sessionId) {
        sessionId = randomUUID();
        reply.setCookie("sessionId", sessionId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          signed: true,
          httpOnly: true,
        });
      }

      return reply.status(201).send({ sessionId });
    }
  );
}
