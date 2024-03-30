import { app } from "../app";
import request from "supertest";
import { prisma } from "../../repositories/prisma/prisma";
import { redis } from "../../repositories/redis/redis";
import { PrismaPollFactory } from "../../../../test/factories/prisma/prisma-poll-factory";

describe("VoteOnPoll [Controller - E2E]", () => {
  beforeEach(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  test("GET /polls/:pollId/votes", async () => {
    const poll = await PrismaPollFactory.createPoll();
    const options = await Promise.all([
      PrismaPollFactory.createOption({ pollId: poll.id }),
      PrismaPollFactory.createOption({ pollId: poll.id }),
      PrismaPollFactory.createOption({ pollId: poll.id }),
    ]);

    const response = await request(app.server)
      .post(`/polls/${poll.id.toString()}/votes`)
      .send({
        pollOptionId: options[0].id.toString(),
      });

    expect(response.status).toEqual(201);

    const votesOnRepository = await prisma.vote.findMany({
      where: { pollId: poll.id.toString() },
    });

    expect(votesOnRepository).toHaveLength(1);
    expect(votesOnRepository[0]).toEqual(
      expect.objectContaining({
        pollOptionId: options[0].id.toString(),
      })
    );

    const votesCountOnCache = await redis.zrange(
      poll.id.toString(),
      0,
      -1,
      "WITHSCORES"
    );

    expect(votesCountOnCache).toHaveLength(2);
    expect(votesCountOnCache[0]).toEqual(options[0].id.toString());
    expect(votesCountOnCache[1]).toEqual("1");
  });
});
