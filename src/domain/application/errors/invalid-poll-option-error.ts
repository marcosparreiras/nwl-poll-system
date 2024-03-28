import { AppError } from "./app-error";

export class InvalidPollOptionError extends AppError {
  public constructor() {
    super("Invalid poll option");
  }
}
