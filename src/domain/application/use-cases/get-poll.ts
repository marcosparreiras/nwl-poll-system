import { Poll } from "../../enterprise/entities/poll";
import { PollWithOptions } from "../../enterprise/object-values/PollWithOptions";
import { PollNotFoundError } from "../errors/poll-not-found-error";
import { PollRepository } from "../repositories/poll-repository";

interface GetPollUseCaseRequest {
  pollId: string;
}

interface GetPollUseCaseResponse {
  pollWithOptions: PollWithOptions;
}

export class GetPollUseCase {
  public constructor(private pollRepository: PollRepository) {}

  public async execute({
    pollId,
  }: GetPollUseCaseRequest): Promise<GetPollUseCaseResponse> {
    const pollWithOptions = await this.pollRepository.findPollByIdWithOptions(
      pollId
    );
    if (!pollWithOptions) {
      throw new PollNotFoundError();
    }

    return { pollWithOptions };
  }
}
