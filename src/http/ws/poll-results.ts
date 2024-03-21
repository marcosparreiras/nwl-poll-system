import { WebSocket } from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";
import { voting } from "../../utils/voting-pub-sub";
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

      voting.subscribe(pollId, (message) => {
        connection.send(JSON.stringify(message));
      });
    }
  );
}
