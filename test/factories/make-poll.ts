import { Poll, PollProps } from "../../src/domain/enterprise/entities/poll";
import { UniqueEntityId } from "../../src/domain/enterprise/entities/core/unique-entity-id";
import { faker } from "@faker-js/faker";

export function makePoll(
  overide: Partial<PollProps> = {},
  id?: UniqueEntityId
) {
  return Poll.create(
    {
      title: `${faker.lorem.sentence(10)} ?`,
      ...overide,
    },
    id
  );
}
