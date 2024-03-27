import { InMemoryPollRepository } from "../../../../test/repositories/in-memory-poll-repository";
import { CreatePollUseCase } from "./create-poll";

describe("CreatePoll [use-case]", () => {
  let inMemoryPollRepository: InMemoryPollRepository;
  let sut: CreatePollUseCase;

  beforeEach(() => {
    inMemoryPollRepository = new InMemoryPollRepository();
    sut = new CreatePollUseCase(inMemoryPollRepository);
  });

  it("Should be able to create a poll with its options", async () => {
    const title = "What is best?";
    const options = ["Pizza", "Hamburguer"];
    const result = await sut.execute({ title, options });

    expect(result.poll).toEqual(
      expect.objectContaining({
        title,
      })
    );

    expect(result.options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: options[0] }),
        expect.objectContaining({ title: options[1] }),
      ])
    );

    const pollOnRepository = inMemoryPollRepository.polls.find(
      (poll) => poll.title === title
    );
    expect(inMemoryPollRepository.polls).toHaveLength(1);
    expect(pollOnRepository).toBeTruthy();

    const optionsOnRepository = inMemoryPollRepository.options;
    expect(optionsOnRepository).toHaveLength(2);
    expect(optionsOnRepository).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: options[0] }),
        expect.objectContaining({ title: options[1] }),
      ])
    );
  });
});
