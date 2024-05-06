import { UseCase } from "almin";
import { HatebuRepository, hatebuRepository } from "../infra/repository/HatebuRepository.js";
import { AppSessionRepository, appSessionRepository } from "../infra/repository/AppSessionRepository.js";

export const createInitializeSystemUseCase = () => {
    return new InitializeSystemUseCase({
        hatebuRepository,
        appSessionRepository
    });
};

export class InitializeSystemUseCase extends UseCase {
    constructor(private repo: { hatebuRepository: HatebuRepository; appSessionRepository: AppSessionRepository }) {
        super();
    }

    async execute() {
        await this.repo.hatebuRepository.ready();
        await this.repo.appSessionRepository.ready();
    }
}
