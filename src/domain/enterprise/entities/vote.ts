import { UniqueEntityId } from "./core/unique-entity-id";
import { Entity } from "./core/entity";
import { Optional } from "./types/optional";

export interface VoteProps {
  userId: UniqueEntityId;
  pollId: UniqueEntityId;
  pollOptionId: UniqueEntityId;
  createdAt: Date;
}

export class Vote extends Entity<VoteProps> {
  get userId(): UniqueEntityId {
    return this.props.userId;
  }

  get pollId(): UniqueEntityId {
    return this.props.pollId;
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
        pollId: props.pollId,
        pollOptionId: props.pollOptionId,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
