import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export function voteOnPoll(app: FastifyInstance) {
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

      return reply.status(201).send();
    }
  );
}
