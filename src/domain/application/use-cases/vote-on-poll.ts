import { Vote } from "../../enterprise/entities/vote";
import { UniqueEntityId } from "../../enterprise/object-values/unique-entity-id";
import { DuplicateVoteError } from "../errors/duplicate-vote-error";
import { InvalidPollOptionError } from "../errors/invalid-poll-option-error";
import { PollNotFoundError } from "../errors/poll-not-found-error";
import { PollRepository } from "../repositories/poll-repository";

interface VoteOnPollUseCaseRequest {
  pollId: string;
  pollOptionId: string;
  userId: string;
}

interface VoteOnPollUseCaseResponse {
  vote: Vote;
}

export class VoteOnPollUseCase {
  public constructor(private pollRepository: PollRepository) {}

  public async execute({
    pollId,
    pollOptionId,
    userId,
  }: VoteOnPollUseCaseRequest): Promise<VoteOnPollUseCaseResponse> {
    const pollWithOptions = await this.pollRepository.findPollByIdWithOptions(
      pollId
    );
    if (!pollWithOptions) {
      throw new PollNotFoundError();
    }
    const pollOptionsIds = pollWithOptions.options.map((option) =>
      option.id.toString()
    );
    if (!pollOptionsIds.includes(pollOptionId)) {
      throw new InvalidPollOptionError();
    }

    const userVote = await this.pollRepository.findUserPollVote(userId, pollId);
    if (userVote && userVote.pollOptionId.toString() === pollOptionId) {
      throw new DuplicateVoteError();
    }
    if (userVote) {
      await this.pollRepository.deleteUserPollVote(userId, pollId);
    }

    const vote = Vote.create({
      userId: new UniqueEntityId(userId),
      pollId: new UniqueEntityId(pollId),
      pollOptionId: new UniqueEntityId(pollOptionId),
    });

    await this.pollRepository.createPollVote(vote);

    return { vote };
  }
}
