import { PollRepository } from "../../src/domain/application/repositories/poll-repository";
import { Poll } from "../../src/domain/enterprise/entities/poll";
import { PollOption } from "../../src/domain/enterprise/entities/poll-option";
import { Vote } from "../../src/domain/enterprise/entities/vote";
import { PollWithOptions } from "../../src/domain/enterprise/object-values/PollWithOptions";

export class InMemoryPollRepository implements PollRepository {
  public polls: Poll[] = [];
  public options: PollOption[] = [];
  public votes: Vote[] = [];

  async createPollWithOptions(
    poll: Poll,
    options: PollOption[]
  ): Promise<void> {
    this.polls.push(poll);
    this.options.push(...options);
  }

  async findPollByIdWithOptions(
    pollId: string
  ): Promise<PollWithOptions | null> {
    const poll = this.polls.find((item) => item.id.toString() === pollId);
    if (!poll) {
      return null;
    }
    const options = this.options.filter(
      (item) => item.pollId.toString() === pollId
    );
    return PollWithOptions.createFromPollAndOptions({ poll, options });
  }

  async findUserPollVote(userId: string, pollId: string): Promise<Vote | null> {
    const vote = this.votes.find(
      (item) =>
        item.pollId.toString() === pollId && item.userId.toString() === userId
    );
    return vote ?? null;
  }

  async deleteUserPollVote(userId: string, pollId: string): Promise<void> {
    const voteIndex = this.votes.findIndex(
      (item) =>
        item.pollId.toString() === pollId && item.userId.toString() === userId
    );
    this.votes.splice(voteIndex, 1);
  }

  async createPollVote(vote: Vote): Promise<void> {
    this.votes.push(vote);
  }
}
