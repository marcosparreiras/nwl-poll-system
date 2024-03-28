import { VoteOnPollUseCase } from "../../domain/application/use-cases/vote-on-poll";
import { PrismaPollRepository } from "../repositories/prisma/prisma-poll-reposiotry";
import { RedisVotesCountRepository } from "../repositories/redis/redis-votes-count-repository";

export function makeVoteOnPollUseCase() {
  const pollRepository = new PrismaPollRepository();
  const votesCountRepository = new RedisVotesCountRepository();
  const useCase = new VoteOnPollUseCase(pollRepository, votesCountRepository);
  return useCase;
}
