import { Poll } from "../entities/poll";
import { PollOption } from "../entities/poll-option";
import { UniqueEntityId } from "./unique-entity-id";
import { ValueObject } from "./value-object";

interface PollAndOptions {
  poll: Poll;
  options: PollOption[];
}

interface PollWithOptionsPorps {
  id: UniqueEntityId;
  title: string;
  createdAt: Date;
  updatedAt?: Date | null;
  options: {
    id: UniqueEntityId;
    title: string;
    score?: number;
  }[];
}

export class PollWithOptions extends ValueObject<PollWithOptionsPorps> {
  get id() {
    return this.props.id;
  }
  get title() {
    return this.props.title;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get options() {
    return this.props.options;
  }

  static create(props: PollWithOptionsPorps) {
    return new PollWithOptions(props);
  }

  static createFromPollAndOptions({ poll, options }: PollAndOptions) {
    const data = this.pollAndOptionsMapper({ poll, options });
    return new PollWithOptions(data);
  }

  private static pollAndOptionsMapper({
    poll,
    options,
  }: PollAndOptions): PollWithOptionsPorps {
    return {
      id: poll.id,
      title: poll.title,
      createdAt: poll.createdAt,
      updatedAt: poll.updatedAt,
      options: options.map((option) => {
        return {
          id: option.id,
          title: option.title,
        };
      }),
    };
  }
}
