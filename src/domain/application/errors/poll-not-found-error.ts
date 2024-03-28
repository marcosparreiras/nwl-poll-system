import { AppError } from "./app-error";

export class PollNotFoundError extends AppError {
  public constructor() {
    super("Poll not found!");
  }
}
