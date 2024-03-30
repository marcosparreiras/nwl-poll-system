import { app } from "../app";
import request from "supertest";
import { prisma } from "../../repositories/prisma/prisma";

describe("CreatePoll [Controller - E2E]", () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  test("POST /polls", async () => {
    const title = "fake question?";
    const options = ["opt-1", "opt-2", "opt-3"];

    const response = await request(app.server)
      .post("/polls")
      .send({ title, options });

    expect(response.status).toEqual(201);
    expect(response.body.pollId).toBeTruthy();

    const pollId = response.body.pollId;
    const pollOnRepository = await prisma.poll.findFirst({ where: { title } });
    const optionsOnRepository = await prisma.pollOption.findMany({
      where: { pollId },
    });

    expect(pollOnRepository?.id).toEqual(pollId);
    expect(optionsOnRepository).toHaveLength(3);
    expect(optionsOnRepository).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: options[0] }),
        expect.objectContaining({ title: options[1] }),
        expect.objectContaining({ title: options[2] }),
      ])
    );
  });
});
