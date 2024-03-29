import { PollRepository } from "../../../domain/application/repositories/poll-repository";
import { Poll } from "../../../domain/enterprise/entities/poll";
import { PollOption } from "../../../domain/enterprise/entities/poll-option";
import { Vote } from "../../../domain/enterprise/entities/vote";
import { PollWithOptions } from "../../../domain/enterprise/object-values/PollWithOptions";
import { UniqueEntityId } from "../../../domain/enterprise/entities/core/unique-entity-id";
import { prisma } from "./prisma";
import { PrismaOptionMapper } from "./mappers/prisma-option-mapper";
import { PrismaPollMapper } from "./mappers/prisma-poll-mapper";
import { PrismaVoteMapper } from "./mappers/prisma-vote-mapper";
import { Optional } from "@prisma/client/runtime/library";
import { PollOption as PrismaPollOption } from "@prisma/client";

export class PrismaPollRepository implements PollRepository {
  async createPollWithOptions(
    poll: Poll,
    options: PollOption[]
  ): Promise<void> {
    const optionsData = options.map((option) => {
      const optionData: Optional<PrismaPollOption, "pollId"> =
        PrismaOptionMapper.toPrisma(option);
      delete optionData.pollId;
      return optionData;
    });

    const pollData = PrismaPollMapper.toPrisma(poll);

    const data = {
      ...pollData,
      options: { createMany: { data: optionsData } },
    };

    await prisma.poll.create({ data });
  }

  async findPollByIdWithOptions(
    pollId: string
  ): Promise<PollWithOptions | null> {
    const prismaPollWithOptions = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: { select: { id: true, title: true } } },
    });

    if (!prismaPollWithOptions) {
      return null;
    }

    return PollWithOptions.create({
      id: new UniqueEntityId(prismaPollWithOptions.id),
      title: prismaPollWithOptions.title,
      createdAt: prismaPollWithOptions.createdAt,
      updatedAt: prismaPollWithOptions.updatedAt,
      options: prismaPollWithOptions.options.map((option) => {
        return {
          id: new UniqueEntityId(option.id),
          title: option.title,
        };
      }),
    });
  }

  async findUserPollVote(userId: string, pollId: string): Promise<Vote | null> {
    const vote = await prisma.vote.findFirst({
      where: {
        pollId,
        sessionId: userId,
      },
    });
    if (!vote) {
      return null;
    }
    return PrismaVoteMapper.toDomain(vote);
  }

  async deleteUserPollVote(userId: string, pollId: string): Promise<void> {
    await prisma.vote.deleteMany({
      where: {
        pollId,
        sessionId: userId,
      },
    });
  }

  async createPollVote(vote: Vote): Promise<void> {
    const data = PrismaVoteMapper.toPrisma(vote);
    await prisma.vote.create({ data });
  }
}
