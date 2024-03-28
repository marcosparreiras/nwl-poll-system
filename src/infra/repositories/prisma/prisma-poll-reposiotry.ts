import { PollRepository } from "../../../domain/application/repositories/poll-repository";
import { Poll } from "../../../domain/enterprise/entities/poll";
import { PollOption } from "../../../domain/enterprise/entities/poll-option";
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
}
