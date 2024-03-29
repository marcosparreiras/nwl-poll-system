import { VotesCountRepository } from "../../src/domain/application/repositories/votes-count-repository";

export class InMemoryVotesCountRepository implements VotesCountRepository {
  public votesCount: Record<string, Record<string, number>> = {};

  async incrementOne(pollId: string, pollOptionId: string): Promise<number> {
    if (!this.votesCount[pollId]) {
      this.votesCount[pollId] = {};
    }
    if (!this.votesCount[pollId][pollOptionId]) {
      this.votesCount[pollId][pollOptionId] = 0;
    }
    this.votesCount[pollId][pollOptionId]++;
    return this.votesCount[pollId][pollOptionId];
  }

  async decrementOne(pollId: string, pollOptionId: string): Promise<number> {
    if (!this.votesCount[pollId]) {
      this.votesCount[pollId] = {};
    }
    if (!this.votesCount[pollId][pollOptionId]) {
      this.votesCount[pollId][pollOptionId] = 0;
    }
    this.votesCount[pollId][pollOptionId]--;
    return this.votesCount[pollId][pollOptionId];
  }

  async fetchByPollId(pollId: string): Promise<Record<string, number>> {
    return this.votesCount[pollId] ?? {};
  }
}
