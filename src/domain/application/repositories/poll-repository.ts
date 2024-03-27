import { Poll } from "../../enterprise/entities/poll";
import { PollOption } from "../../enterprise/entities/poll-option";

export interface PollRepository {
  createPollWithOptions(poll: Poll, options: PollOption[]): Promise<void>;
}
