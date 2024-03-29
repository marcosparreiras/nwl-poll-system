import { WebSocket } from "@fastify/websocket";
import { FastifyRequest } from "fastify";
import { voteEvents } from "../../../domain/enterprise/events/vote-events";
import z from "zod";

export async function pollResults(
  connection: WebSocket,
  request: FastifyRequest
) {
  const requestParamsSchema = z.object({
    pollId: z.string(),
  });
  const { pollId } = requestParamsSchema.parse(request.params);

  voteEvents.subscribe(pollId, (message) => {
    connection.send(JSON.stringify(message));
  });
}
