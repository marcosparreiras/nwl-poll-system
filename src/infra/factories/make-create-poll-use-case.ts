import { CreatePollUseCase } from "../../domain/application/use-cases/create-poll";
import { PrismaPollRepository } from "../repositories/prisma/prisma-poll-reposiotry";

export function makeCreatePollUseCase() {
  const pollRepository = new PrismaPollRepository();
  const useCase = new CreatePollUseCase(pollRepository);
  return useCase;
}
