import { UniqueEntityId } from "../object-values/unique-entity-id";
import { Entity } from "./entity";
import { Optional } from "./types/optional";

interface VoteProps {
  userId: UniqueEntityId;
  pollOptionId: UniqueEntityId;
  createdAt: Date;
}

export class Vote extends Entity<VoteProps> {
  get userId(): UniqueEntityId {
    return this.props.userId;
  }

  get pollOptionId(): UniqueEntityId {
    return this.props.pollOptionId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  public static create(
    props: Optional<VoteProps, "createdAt">,
    id?: UniqueEntityId
  ) {
    return new Vote(
      {
        userId: props.userId,
        pollOptionId: props.pollOptionId,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
