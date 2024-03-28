import { AppError } from "./app-error";

export class DuplicateVoteError extends AppError {
  public constructor() {
    super("User already voted on this option");
  }
}
