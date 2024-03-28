export interface VotesCountRepository {
  incrementOne(pollId: string, pollOptionId: string): Promise<number>;
  decrementOne(pollId: string, pollOptionId: string): Promise<number>;
}
