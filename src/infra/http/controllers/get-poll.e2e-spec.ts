import { app } from "../app";
import request from "supertest";
import { redis } from "../../repositories/redis/redis";
import { PrismaPollFactory } from "../../../../test/factories/prisma/prisma-poll-factory";

describe("GetPoll [Controller - E2E]", () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  test("GET /polls/:pollId", async () => {
    const poll = await PrismaPollFactory.createPoll();
    const options = await Promise.all([
      PrismaPollFactory.createOption({ pollId: poll.id }),
      PrismaPollFactory.createOption({ pollId: poll.id }),
      PrismaPollFactory.createOption({ pollId: poll.id }),
    ]);
    await Promise.all([
      redis.zincrby(poll.id.toString(), 6, options[0].id.toString()),
      redis.zincrby(poll.id.toString(), 4, options[1].id.toString()),
      redis.zincrby(poll.id.toString(), 1, options[2].id.toString()),
    ]);

    const response = await request(app.server)
      .get(`/polls/${poll.id.toString()}`)
      .send();

    expect(response.status).toEqual(200);
    expect(response.body.poll).toEqual(
      expect.objectContaining({
        id: poll.id.toString(),
        options: expect.arrayContaining([
          expect.objectContaining({
            id: options[0].id.toString(),
            score: 6,
          }),
          expect.objectContaining({
            id: options[1].id.toString(),
            score: 4,
          }),
          expect.objectContaining({
            id: options[2].id.toString(),
            score: 1,
          }),
        ]),
      })
    );
  });
});
