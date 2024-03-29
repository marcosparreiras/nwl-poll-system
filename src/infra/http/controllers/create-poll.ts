import { FastifyReply, FastifyRequest } from "fastify";
import { makeCreatePollUseCase } from "../../factories/make-create-poll-use-case";
import z from "zod";

export async function createPoll(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    title: z.string(),
    options: z.array(z.string()),
  });

  try {
    const { title, options } = requestBodySchema.parse(request.body);
    const createPollUseCase = makeCreatePollUseCase();
    const { poll } = await createPollUseCase.execute({ title, options });
    return reply.status(201).send({ pollId: poll.id.toString() });
  } catch (error: unknown) {
    return reply.status(500).send({ message: "Internal server error" });
  }
}
