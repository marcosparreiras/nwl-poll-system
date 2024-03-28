import { Vote as PrismaVote } from "@prisma/client";
import { Vote } from "../../../../domain/enterprise/entities/vote";
import { UniqueEntityId } from "../../../../domain/enterprise/object-values/unique-entity-id";

export class PrismaVoteMapper {
  static toDomain(data: PrismaVote): Vote {
    return Vote.create(
      {
        pollId: new UniqueEntityId(data.pollId),
        pollOptionId: new UniqueEntityId(data.pollOptionId),
        userId: new UniqueEntityId(data.sessionId),
        createdAt: data.createdAt,
      },
      new UniqueEntityId(data.id)
    );
  }

  static toPrisma(data: Vote): PrismaVote {
    return {
      id: data.id.toString(),
      pollId: data.pollId.toString(),
      pollOptionId: data.pollOptionId.toString(),
      sessionId: data.userId.toString(),
      createdAt: data.createdAt,
    };
  }
}
