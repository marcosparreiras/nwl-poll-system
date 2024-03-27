import { UniqueEntityId } from "../object-values/unique-entity-id";
import { Entity } from "./entity";

interface PollOptionProps {
  title: string;
  pollId: UniqueEntityId;
}

export class PollOption extends Entity<PollOptionProps> {
  get title(): string {
    return this.props.title;
  }

  get pollId(): UniqueEntityId {
    return this.props.pollId;
  }

  public static create(props: PollOptionProps, id?: UniqueEntityId) {
    return new PollOption(
      {
        title: props.title,
        pollId: props.pollId,
      },
      id
    );
  }
}
