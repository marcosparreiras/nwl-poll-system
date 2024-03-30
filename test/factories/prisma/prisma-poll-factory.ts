import { UniqueEntityId } from "../../../src/domain/enterprise/entities/core/unique-entity-id";
import { Poll, PollProps } from "../../../src/domain/enterprise/entities/poll";
import { makePoll } from "../make-poll";
import { PrismaPollMapper } from "../../../src/infra/repositories/prisma/mappers/prisma-poll-mapper";
import {
  PollOption,
  PollOptionProps,
} from "../../../src/domain/enterprise/entities/poll-option";
import { makePollOption } from "../make-poll-option";
import { PrismaOptionMapper } from "../../../src/infra/repositories/prisma/mappers/prisma-option-mapper";
import { prisma } from "../../../src/infra/repositories/prisma/prisma";
import { Vote, VoteProps } from "../../../src/domain/enterprise/entities/vote";
import { makeVote } from "../make-vote";
import { PrismaVoteMapper } from "../../../src/infra/repositories/prisma/mappers/prisma-vote-mapper";

export class PrismaPollFactory {
  public static async createPoll(
    overide: Partial<PollProps> = {},
    id?: UniqueEntityId
  ): Promise<Poll> {
    const poll = makePoll(overide, id);
    const data = PrismaPollMapper.toPrisma(poll);
    await prisma.poll.create({ data });
    return poll;
  }

  public static async createOption(
    overide: Partial<PollOptionProps> = {},
    id?: UniqueEntityId
  ): Promise<PollOption> {
    const option = makePollOption(overide, id);
    const data = PrismaOptionMapper.toPrisma(option);
    await prisma.pollOption.create({ data });
    return option;
  }

  public static async createVote(
    overide: Partial<VoteProps> = {},
    id?: UniqueEntityId
  ): Promise<Vote> {
    const vote = makeVote(overide, id);
    const data = PrismaVoteMapper.toPrisma(vote);
    await prisma.vote.create({ data });
    return vote;
  }
}
