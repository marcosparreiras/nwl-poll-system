import { Vote } from "../../enterprise/entities/vote";
import { voteEvents } from "../../enterprise/events/vote-events";
import { UniqueEntityId } from "../../enterprise/entities/core/unique-entity-id";
import { DuplicateVoteError } from "../errors/duplicate-vote-error";
import { InvalidPollOptionError } from "../errors/invalid-poll-option-error";
import { PollNotFoundError } from "../errors/poll-not-found-error";
import { PollRepository } from "../repositories/poll-repository";
import { VotesCountRepository } from "../repositories/votes-count-repository";

interface VoteOnPollUseCaseRequest {
  pollId: string;
  pollOptionId: string;
  userId: string;
}

interface VoteOnPollUseCaseResponse {
  vote: Vote;
}

export class VoteOnPollUseCase {
  public constructor(
    private pollRepository: PollRepository,
    private votesCountRepository: VotesCountRepository
  ) {}

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

    const userPreviousVote = await this.pollRepository.findUserPollVote(
      userId,
      pollId
    );
    if (
      userPreviousVote &&
      userPreviousVote.pollOptionId.toString() === pollOptionId
    ) {
      throw new DuplicateVoteError();
    }
    if (userPreviousVote) {
      await this.pollRepository.deleteUserPollVote(userId, pollId);
      const votes = await this.votesCountRepository.decrementOne(
        pollId,
        userPreviousVote.pollOptionId.toString()
      );
      voteEvents.publish(pollId, {
        pollOptionId: userPreviousVote.pollOptionId.toString(),
        votes,
      });
    }

    const vote = Vote.create({
      userId: new UniqueEntityId(userId),
      pollId: new UniqueEntityId(pollId),
      pollOptionId: new UniqueEntityId(pollOptionId),
    });

    await this.pollRepository.createPollVote(vote);
    const votes = await this.votesCountRepository.incrementOne(
      pollId,
      pollOptionId
    );
    voteEvents.publish(pollId, { pollOptionId, votes });

    return { vote };
  }
}
