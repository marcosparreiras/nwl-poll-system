import { UniqueEntityId } from "./unique-entity-id";

export abstract class Entity<Props> {
  protected props: Props;
  private _id: UniqueEntityId;

  get id() {
    return this._id;
  }

  protected constructor(props: Props, id?: UniqueEntityId) {
    this.props = props;
    this._id = id ?? new UniqueEntityId();
  }
}
