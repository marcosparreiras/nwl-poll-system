import { randomUUID } from "node:crypto";

export class UniqueEntityId {
  private value: string;

  public toString(): string {
    return this.value;
  }

  public constructor(id?: string) {
    this.value = id ?? randomUUID();
  }
}
