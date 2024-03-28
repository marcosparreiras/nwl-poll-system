import { randomUUID } from "node:crypto";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../../domain/application/errors/app-error";
import { makeVoteOnPollUseCase } from "../../factories/make-vote-on-poll-use-case";
import z from "zod";

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

      try {
        const { pollId } = requestParamsSchema.parse(request.params);
        const { pollOptionId } = requestBodySchema.parse(request.body);
        const voteOnPollUseCase = makeVoteOnPollUseCase();
        await voteOnPollUseCase.execute({
          pollId,
          pollOptionId,
          userId: sessionId,
        });
        return reply.status(201).send();
      } catch (error: unknown) {
        if (error instanceof AppError) {
          return reply.status(400).send({ message: error.message });
        }
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
}
