import { UseCase } from "almin";
import { createHatebu } from "../domain/Hatebu/HatebuFactory";
import { HatebuRepository, hatebuRepository } from "../infra/repository/HatebuRepository";

export const createCreateHatebuUserUseCase = () => {
    return new CreateHatebuUserUseCase({
        hatebuRepository
    });
};

export class CreateHatebuUserUseCase extends UseCase {
    constructor(private repo: { hatebuRepository: HatebuRepository }) {
        super();
    }

    shouldExecute(userName: string) {
        const existingHatebu = this.repo.hatebuRepository.findByUserName(userName);
        return existingHatebu === undefined;
    }

    execute(userName: string) {
        const hatebu = createHatebu(userName);
        return this.repo.hatebuRepository.save(hatebu);
    }
}
