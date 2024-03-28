import { Poll } from "../../enterprise/entities/poll";
import { PollOption } from "../../enterprise/entities/poll-option";
import { Vote } from "../../enterprise/entities/vote";
import { PollWithOptions } from "../../enterprise/object-values/PollWithOptions";

export interface PollRepository {
  findPollByIdWithOptions(pollId: string): Promise<PollWithOptions | null>;
  createPollWithOptions(poll: Poll, options: PollOption[]): Promise<void>;
  findUserPollVote(userId: string, pollId: string): Promise<Vote | null>;
  deleteUserPollVote(userId: string, pollId: string): Promise<void>;
  createPollVote(vote: Vote): Promise<void>;
}
