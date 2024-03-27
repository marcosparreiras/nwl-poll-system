import { Poll } from "../../enterprise/entities/poll";
import { PollOption } from "../../enterprise/entities/poll-option";
import { PollRepository } from "../repositories/poll-repository";

interface CreatePollUseCaseRequest {
  title: string;
  options: string[];
}

interface CreatePollUseCaseResponse {
  poll: Poll;
  options: PollOption[];
}

export class CreatePollUseCase {
  public constructor(private pollRepository: PollRepository) {}

  public async execute({
    title,
    options,
  }: CreatePollUseCaseRequest): Promise<CreatePollUseCaseResponse> {
    const poll = Poll.create({ title });
    const pollOptions = options.map((option) =>
      PollOption.create({ title: option, pollId: poll.id })
    );

    await this.pollRepository.createPollWithOptions(poll, pollOptions);

    return { poll, options: pollOptions };
  }
}
