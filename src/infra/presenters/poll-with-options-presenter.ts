import { PollWithOptions } from "../../domain/enterprise/object-values/PollWithOptions";

export class PollWithOptionsPresenter {
  public static toHTTP(data: PollWithOptions) {
    return {
      id: data.id.toString(),
      title: data.title,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt ?? null,
      options: data.options.map((opt) => {
        return {
          id: opt.id.toString(),
          title: opt.title,
          score: opt.score,
        };
      }),
    };
  }
}
