import { UseCase } from "almin";
import { HatebuRepository, hatebuRepository } from "../infra/repository/HatebuRepository";

export const createInitializeSystemUseCase = () => {
    return new InitializeSystemUseCase({
        hatebuRepository
    });
};

export class InitializeSystemUseCase extends UseCase {
    constructor(private repo: { hatebuRepository: HatebuRepository }) {
        super();
    }

    async execute(userName?: string) {
        return this.repo.hatebuRepository.ready();
    }
}
