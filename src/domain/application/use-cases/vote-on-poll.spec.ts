import { makePoll } from "../../../../test/factories/make-poll";
import { makePollOption } from "../../../../test/factories/make-poll-option";
import { InMemoryPollRepository } from "../../../../test/repositories/in-memory-poll-repository";
import { VoteOnPollUseCase } from "./vote-on-poll";
import { UniqueEntityId } from "../../enterprise/entities/core/unique-entity-id";
import { PollNotFoundError } from "../errors/poll-not-found-error";
import { InvalidPollOptionError } from "../errors/invalid-poll-option-error";
import { Vote } from "../../enterprise/entities/vote";
import { makeVote } from "../../../../test/factories/make-vote";
import { DuplicateVoteError } from "../errors/duplicate-vote-error";
import { InMemoryVotesCountRepository } from "../../../../test/repositories/in-memory-votes-count-repository";
import { voteEvents } from "../../enterprise/events/vote-events";

describe("VoteOnPoll [use-case]", () => {
  let inMemoryPollRepository: InMemoryPollRepository;
  let inMemoryVotesCountRepository: InMemoryVotesCountRepository;
  let sut: VoteOnPollUseCase;

  beforeEach(() => {
    inMemoryPollRepository = new InMemoryPollRepository();
    inMemoryVotesCountRepository = new InMemoryVotesCountRepository();
    sut = new VoteOnPollUseCase(
      inMemoryPollRepository,
      inMemoryVotesCountRepository
    );
  });

  it("Should be able to vote on a poll option", async () => {
    const userId = new UniqueEntityId();
    const poll = makePoll();
    const pollOptions = new Array(2).fill(null).map((_) => {
      return makePollOption({ pollId: poll.id });
    });

    inMemoryPollRepository.polls.push(poll);
    inMemoryPollRepository.options.push(...pollOptions);

    const result = await sut.execute({
      userId: userId.toString(),
      pollId: poll.id.toString(),
      pollOptionId: pollOptions[0].id.toString(),
    });

    expect(result.vote).toEqual(
      expect.objectContaining({
        userId,
        pollId: poll.id,
        pollOptionId: pollOptions[0].id,
      })
    );

    const voteOnRepository = inMemoryPollRepository.votes.find(
      (item) => item.id.toString() === result.vote.id.toString()
    );
    expect(voteOnRepository).toBeInstanceOf(Vote);
  });

  it("Should not be able to vote on an unexistent poll", async () => {
    const userId = new UniqueEntityId();
    await expect(() =>
      sut.execute({
        userId: userId.toString(),
        pollId: new UniqueEntityId().toString(),
        pollOptionId: new UniqueEntityId().toString(),
      })
    ).rejects.toBeInstanceOf(PollNotFoundError);
  });

  it("Should not be able to vote on an unexistent poll option", async () => {
    const userId = new UniqueEntityId();
    const poll = makePoll();

    inMemoryPollRepository.polls.push(poll);

    await expect(() =>
      sut.execute({
        userId: userId.toString(),
        pollId: poll.id.toString(),
        pollOptionId: new UniqueEntityId().toString(),
      })
    ).rejects.toBeInstanceOf(InvalidPollOptionError);
  });

  it("Should not be able to vote twice in same poll option", async () => {
    const userId = new UniqueEntityId();
    const poll = makePoll();
    const pollOptions = new Array(2).fill(null).map((_) => {
      return makePollOption({ pollId: poll.id });
    });

    const vote = makeVote({
      userId,
      pollId: poll.id,
      pollOptionId: pollOptions[0].id,
    });

    inMemoryPollRepository.polls.push(poll);
    inMemoryPollRepository.options.push(...pollOptions);
    inMemoryPollRepository.votes.push(vote);

    await expect(() =>
      sut.execute({
        userId: vote.userId.toString(),
        pollId: vote.pollId.toString(),
        pollOptionId: vote.pollOptionId.toString(),
      })
    ).rejects.toBeInstanceOf(DuplicateVoteError);
  });

  it("Should be able to change user vote on a poll", async () => {
    const userId = new UniqueEntityId();
    const poll = makePoll();
    const pollOptions = new Array(2).fill(null).map((_) => {
      return makePollOption({ pollId: poll.id });
    });

    const vote = makeVote({
      userId,
      pollId: poll.id,
      pollOptionId: pollOptions[0].id,
    });

    inMemoryPollRepository.polls.push(poll);
    inMemoryPollRepository.options.push(...pollOptions);
    inMemoryPollRepository.votes.push(vote);

    const result = await sut.execute({
      userId: vote.userId.toString(),
      pollId: vote.pollId.toString(),
      pollOptionId: pollOptions[1].id.toString(),
    });

    expect(result.vote).toBeTruthy();
    expect(inMemoryPollRepository.votes).toHaveLength(1);

    const voteOnRepository = inMemoryPollRepository.votes.find(
      (item) => item.id.toString() === result.vote.id.toString()
    );
    expect(voteOnRepository).toBeTruthy();
  });

  it("Should be able to manage the vote count when a new vote is created", async () => {
    const userId = new UniqueEntityId();
    const poll = makePoll();
    const pollOptions = new Array(2).fill(null).map((_) => {
      return makePollOption({ pollId: poll.id });
    });

    inMemoryPollRepository.polls.push(poll);
    inMemoryPollRepository.options.push(...pollOptions);

    const result = await sut.execute({
      userId: userId.toString(),
      pollId: poll.id.toString(),
      pollOptionId: pollOptions[0].id.toString(),
    });

    expect(result.vote).toBeTruthy();
    const voteCount =
      inMemoryVotesCountRepository.votesCount[poll.id.toString()][
        pollOptions[0].id.toString()
      ];
    expect(voteCount).toEqual(1);
  });

  it("Should be able to manage the vote count when a user change your vote", async () => {
    const userId = new UniqueEntityId();
    const poll = makePoll();
    const pollOptions = new Array(2).fill(null).map((_) => {
      return makePollOption({ pollId: poll.id });
    });

    inMemoryPollRepository.polls.push(poll);
    inMemoryPollRepository.options.push(...pollOptions);

    await sut.execute({
      userId: userId.toString(),
      pollId: poll.id.toString(),
      pollOptionId: pollOptions[0].id.toString(),
    });

    await sut.execute({
      userId: userId.toString(),
      pollId: poll.id.toString(),
      pollOptionId: pollOptions[1].id.toString(),
    });

    const voteCount =
      inMemoryVotesCountRepository.votesCount[poll.id.toString()];

    expect(voteCount).toEqual(
      expect.objectContaining({
        [pollOptions[0].id.toString()]: 0,
        [pollOptions[1].id.toString()]: 1,
      })
    );
  });

  it("Should be able to publish a vote-event when a new vote is created", async () => {
    const spy = vi.spyOn(voteEvents, "publish");
    const userId = new UniqueEntityId();
    const poll = makePoll();
    const pollOptions = new Array(2).fill(null).map((_) => {
      return makePollOption({ pollId: poll.id });
    });

    inMemoryPollRepository.polls.push(poll);
    inMemoryPollRepository.options.push(...pollOptions);

    await sut.execute({
      userId: userId.toString(),
      pollId: poll.id.toString(),
      pollOptionId: pollOptions[0].id.toString(),
    });

    expect(spy).toBeCalledTimes(1);

    await sut.execute({
      userId: userId.toString(),
      pollId: poll.id.toString(),
      pollOptionId: pollOptions[1].id.toString(),
    });

    expect(spy).toBeCalledTimes(3);
  });
});
