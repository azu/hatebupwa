import { UseCase } from "almin";
import { HatebuRepository, hatebuRepository } from "../infra/repository/HatebuRepository";
import { SwitchCurrentHatebuUserUseCase } from "./SwitchCurrentHatebuUserUseCase";

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
        await this.repo.hatebuRepository.ready();
        if (!userName) {
            return;
        }
        const hatebu = this.repo.hatebuRepository.findByUserName(userName);
        if (!hatebu) {
            return;
        }
        return this.context
            .useCase(new SwitchCurrentHatebuUserUseCase())
            .executor(useCase => useCase.execute(userName));
    }
}
