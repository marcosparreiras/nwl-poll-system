import { WebSocket } from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";
import { voteEvents } from "../../../domain/enterprise/events/vote-events";
import z from "zod";

export async function pollResults(app: FastifyInstance) {
  app.get(
    "/polls/:pollId/results",
    { websocket: true },
    (connection: WebSocket, request: FastifyRequest) => {
      const requestParamsSchema = z.object({
        pollId: z.string(),
      });
      const { pollId } = requestParamsSchema.parse(request.params);

      voteEvents.subscribe(pollId, (message) => {
        connection.send(JSON.stringify(message));
      });
    }
  );
}
