import { UniqueEntityId } from "../object-values/unique-entity-id";
import { Entity } from "./entity";

interface PollOptionsProps {
  title: string;
  pollId: UniqueEntityId;
}

export class PollOptions extends Entity<PollOptionsProps> {
  get title(): string {
    return this.props.title;
  }

  get pollId(): UniqueEntityId {
    return this.props.pollId;
  }

  public static create(props: PollOptionsProps, id?: UniqueEntityId) {
    return new PollOptions(
      {
        title: props.title,
        pollId: props.pollId,
      },
      id
    );
  }
}
