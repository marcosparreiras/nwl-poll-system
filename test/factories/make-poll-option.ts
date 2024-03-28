import { faker } from "@faker-js/faker";
import {
  PollOption,
  PollOptionProps,
} from "../../src/domain/enterprise/entities/poll-option";
import { UniqueEntityId } from "../../src/domain/enterprise/object-values/unique-entity-id";

export function makePollOption(
  overide: Partial<PollOptionProps> = {},
  id?: UniqueEntityId
) {
  return PollOption.create(
    {
      title: faker.lorem.sentence(4),
      pollId: new UniqueEntityId(),
      ...overide,
    },
    id
  );
}
