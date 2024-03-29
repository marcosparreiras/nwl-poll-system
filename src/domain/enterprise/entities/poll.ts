import { UniqueEntityId } from "./core/unique-entity-id";
import { Entity } from "./core/entity";
import { Optional } from "./types/optional";

export interface PollProps {
  title: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Poll extends Entity<PollProps> {
  get title(): string {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;
    this.touch();
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  public static create(
    props: Optional<PollProps, "createdAt">,
    id?: UniqueEntityId
  ) {
    return new Poll(
      {
        title: props.title,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt,
      },
      id
    );
  }
}
