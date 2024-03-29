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

  async fetchByPollId(pollId: string): Promise<Record<string, number>> {
    const redisResultArray = await redis.zrange(pollId, 0, -1, "WITHSCORES");
    const scores = redisResultArray.reduce<Record<string, number>>(
      (acc, cur, index) => {
        if (index % 2 === 0) {
          acc[cur] = Number(redisResultArray[index + 1]);
        }
        return acc;
      },
      {}
    );
    return scores;
  }
}
