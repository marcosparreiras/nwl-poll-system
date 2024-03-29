import { FastifyReply, FastifyRequest } from "fastify";
import { makeGetPollUseCase } from "../../factories/make-get-poll-use-case";
import { AppError } from "../../../domain/application/errors/app-error";
import z from "zod";
import { PollWithOptionsPresenter } from "../../presenters/poll-with-options-presenter";

export async function getPoll(request: FastifyRequest, reply: FastifyReply) {
  const requestParamsSchema = z.object({
    pollId: z.string().uuid(),
  });
  try {
    const { pollId } = requestParamsSchema.parse(request.params);
    const getPollUseCase = makeGetPollUseCase();
    const { pollWithOptions } = await getPollUseCase.execute({ pollId });
    return reply
      .status(200)
      .send({ poll: PollWithOptionsPresenter.toHTTP(pollWithOptions) });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return reply.status(400).send({ message: error.message });
    }
    return reply.status(500).send({ message: "Internal server error" });
  }
}
