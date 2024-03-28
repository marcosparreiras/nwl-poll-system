import { Poll as PrismaPoll } from "@prisma/client";
import { Poll } from "../../../../domain/enterprise/entities/poll";
import { UniqueEntityId } from "../../../../domain/enterprise/object-values/unique-entity-id";

export class PrismaPollMapper {
  static toDomain(data: PrismaPoll): Poll {
    return Poll.create(
      {
        title: data.title,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(data.id)
    );
  }

  static toPrisma(data: Poll): PrismaPoll {
    return {
      id: data.id.toString(),
      title: data.title,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt ?? null,
    };
  }
}
