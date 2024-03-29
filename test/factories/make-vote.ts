import { UniqueEntityId } from "../../src/domain/enterprise/entities/core/unique-entity-id";
import { Vote, VoteProps } from "../../src/domain/enterprise/entities/vote";

export function makeVote(
  overide: Partial<VoteProps> = {},
  id?: UniqueEntityId
) {
  return Vote.create(
    {
      pollId: new UniqueEntityId(),
      pollOptionId: new UniqueEntityId(),
      userId: new UniqueEntityId(),
      ...overide,
    },
    id
  );
}
