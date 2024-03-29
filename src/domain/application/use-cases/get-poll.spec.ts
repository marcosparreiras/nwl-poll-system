import { makePoll } from "../../../../test/factories/make-poll";
import { makePollOption } from "../../../../test/factories/make-poll-option";
import { InMemoryPollRepository } from "../../../../test/repositories/in-memory-poll-repository";
import { InMemoryVotesCountRepository } from "../../../../test/repositories/in-memory-votes-count-repository";
import { GetPollUseCase } from "./get-poll";

describe("GetPoll [use-case]", () => {
  let inMemoryPollRepository: InMemoryPollRepository;
  let inMemoryVotesCountRepository: InMemoryVotesCountRepository;
  let sut: GetPollUseCase;

  beforeEach(() => {
    inMemoryPollRepository = new InMemoryPollRepository();
    inMemoryVotesCountRepository = new InMemoryVotesCountRepository();
    sut = new GetPollUseCase(
      inMemoryPollRepository,
      inMemoryVotesCountRepository
    );
  });

  it("Should be to fetch a poll", async () => {
    const poll = makePoll();
    inMemoryPollRepository.polls.push(poll);

    const result = await sut.execute({ pollId: poll.id.toString() });
    expect(result.pollWithOptions).toEqual(
      expect.objectContaining({
        title: poll.title,
        id: poll.id,
      })
    );
  });

  it("Should be able to fetch a poll with its options", async () => {
    const poll = makePoll();
    const pollOptions = new Array(3).fill(null).map(() => {
      return makePollOption({ pollId: poll.id });
    });

    inMemoryPollRepository.polls.push(poll);
    inMemoryPollRepository.options.push(...pollOptions);

    const result = await sut.execute({ pollId: poll.id.toString() });
    expect(result.pollWithOptions).toEqual(
      expect.objectContaining({
        id: poll.id,
        options: expect.arrayContaining([
          expect.objectContaining({ id: pollOptions[0].id }),
          expect.objectContaining({ id: pollOptions[1].id }),
          expect.objectContaining({ id: pollOptions[2].id }),
        ]),
      })
    );
    expect(result.pollWithOptions.options).toHaveLength(3);
  });

  it("Should be able to fetch a poll with options scores", async () => {
    const poll = makePoll();
    const pollOptions = new Array(3).fill(null).map(() => {
      return makePollOption({ pollId: poll.id });
    });

    inMemoryPollRepository.polls.push(poll);
    inMemoryPollRepository.options.push(...pollOptions);

    inMemoryVotesCountRepository.votesCount[poll.id.toString()] = {};
    for (let i = 0; i < pollOptions.length; i++) {
      inMemoryVotesCountRepository.votesCount[poll.id.toString()][
        pollOptions[i].id.toString()
      ] = i * 2;
    }

    const result = await sut.execute({ pollId: poll.id.toString() });

    expect(result.pollWithOptions.options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: pollOptions[0].id, score: 0 }),
        expect.objectContaining({ id: pollOptions[1].id, score: 2 }),
        expect.objectContaining({ id: pollOptions[2].id, score: 4 }),
      ])
    );
  });
});
