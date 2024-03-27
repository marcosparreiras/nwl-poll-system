import { PollRepository } from "../../src/domain/application/repositories/poll-repository";
import { Poll } from "../../src/domain/enterprise/entities/poll";
import { PollOption } from "../../src/domain/enterprise/entities/poll-option";

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
}
