import { PollOption as PrismaPollOption } from "@prisma/client";
import { PollOption } from "../../../../domain/enterprise/entities/poll-option";
import { UniqueEntityId } from "../../../../domain/enterprise/object-values/unique-entity-id";

export class PrismaOptionMapper {
  static toDomain(data: PrismaPollOption): PollOption {
    return PollOption.create(
      {
        title: data.title,
        pollId: new UniqueEntityId(data.pollId),
      },
      new UniqueEntityId(data.id)
    );
  }

  static toPrisma(data: PollOption): PrismaPollOption {
    return {
      id: data.id.toString(),
      pollId: data.pollId.toString(),
      title: data.title,
    };
  }
}
