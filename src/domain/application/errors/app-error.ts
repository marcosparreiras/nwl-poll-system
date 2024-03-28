export class AppError extends Error {
  protected constructor(message: string) {
    super(message);
  }
}
