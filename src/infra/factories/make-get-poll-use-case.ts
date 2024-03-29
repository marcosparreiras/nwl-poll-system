import { GetPollUseCase } from "../../domain/application/use-cases/get-poll";
import { PrismaPollRepository } from "../repositories/prisma/prisma-poll-reposiotry";
import { RedisVotesCountRepository } from "../repositories/redis/redis-votes-count-repository";

export function makeGetPollUseCase() {
  const pollRepository = new PrismaPollRepository();
  const votesCountRepository = new RedisVotesCountRepository();
  const useCase = new GetPollUseCase(pollRepository, votesCountRepository);
  return useCase;
}
