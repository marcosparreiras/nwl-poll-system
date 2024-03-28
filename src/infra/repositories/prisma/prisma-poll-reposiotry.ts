import { PollRepository } from "../../../domain/application/repositories/poll-repository";
import { Poll } from "../../../domain/enterprise/entities/poll";
import { PollOption } from "../../../domain/enterprise/entities/poll-option";
import { PollWithOptions } from "../../../domain/enterprise/object-values/PollWithOptions";
import { UniqueEntityId } from "../../../domain/enterprise/object-values/unique-entity-id";
import { prisma } from "../../lib/prisma";
import { PrismaOptionMapper } from "./mappers/prisma-option-mapper";
import { PrismaPollMapper } from "./mappers/prisma-poll-mapper";

export class PrismaPollRepository implements PollRepository {
  async createPollWithOptions(
    poll: Poll,
    options: PollOption[]
  ): Promise<void> {
    const optionsData = options.map((option) =>
      PrismaOptionMapper.toPrisma(option)
    );

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
}