import { PollWithOptions } from "../../enterprise/object-values/PollWithOptions";
import { PollNotFoundError } from "../errors/poll-not-found-error";
import { PollRepository } from "../repositories/poll-repository";
import { VotesCountRepository } from "../repositories/votes-count-repository";

interface GetPollUseCaseRequest {
  pollId: string;
}

interface GetPollUseCaseResponse {
  pollWithOptions: PollWithOptions;
}

export class GetPollUseCase {
  public constructor(
    private pollRepository: PollRepository,
    private votesCountRepository: VotesCountRepository
  ) {}

  public async execute({
    pollId,
  }: GetPollUseCaseRequest): Promise<GetPollUseCaseResponse> {
    const pollWithOptions = await this.pollRepository.findPollByIdWithOptions(
      pollId
    );
    if (!pollWithOptions) {
      throw new PollNotFoundError();
    }

    const pollOptionVotes = await this.votesCountRepository.fetchByPollId(
      pollId
    );

    pollWithOptions.options.forEach((option) => {
      option.score = pollOptionVotes[option.id.toString()] ?? 0;
    });

    return { pollWithOptions };
  }
}
