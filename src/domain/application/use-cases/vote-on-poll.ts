import { Vote } from "../../enterprise/entities/vote";
import { UniqueEntityId } from "../../enterprise/object-values/unique-entity-id";
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
    const userVote = await this.pollRepository.findUserPollVote(userId, pollId);
    if (userVote && userVote.pollOptionId.toString() === pollOptionId) {
      throw new Error("User already voted on this option");
    }
    if (userVote) {
      await this.pollRepository.deleteUserPollVote(userId, pollId);
    }

    const vote = Vote.create({
      pollOptionId: new UniqueEntityId(pollOptionId),
      userId: new UniqueEntityId(userId),
    });

    await this.pollRepository.createPollVote(vote);

    return { vote };
  }
}
