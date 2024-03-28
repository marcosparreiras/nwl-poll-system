import { PollRepository } from "../../src/domain/application/repositories/poll-repository";
import { Poll } from "../../src/domain/enterprise/entities/poll";
import { PollOption } from "../../src/domain/enterprise/entities/poll-option";
import { PollWithOptions } from "../../src/domain/enterprise/object-values/PollWithOptions";

export class InMemoryPollRepository implements PollRepository {
  public polls: Poll[] = [];
  public options: PollOption[] = [];

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
}
