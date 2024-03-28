import { Poll } from "../../enterprise/entities/poll";
import { PollOption } from "../../enterprise/entities/poll-option";
import { Vote } from "../../enterprise/entities/vote";
import { PollWithOptions } from "../../enterprise/object-values/PollWithOptions";

export interface PollRepository {
  createPollWithOptions(poll: Poll, options: PollOption[]): Promise<void>;
  findPollByIdWithOptions(pollId: string): Promise<PollWithOptions | null>;
  findUserPollVote(userId: string, pollId: string): Promise<Vote | null>;
  deleteUserPollVote(userId: string, pollId: string): Promise<void>;
  createPollVote(vote: Vote): Promise<void>;
}
