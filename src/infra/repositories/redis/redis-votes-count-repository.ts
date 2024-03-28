import { VotesCountRepository } from "../../../domain/application/repositories/votes-count-repository";
import { redis } from "./redis";

export class RedisVotesCountRepository implements VotesCountRepository {
  async incrementOne(pollId: string, pollOptionId: string): Promise<number> {
    const count = await redis.zincrby(pollId, 1, pollOptionId);
    return Number(count);
  }

  async decrementOne(pollId: string, pollOptionId: string): Promise<number> {
    const count = await redis.zincrby(pollId, -1, pollOptionId);
    return Number(count);
  }
}
