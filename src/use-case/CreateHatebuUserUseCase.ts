import { UseCase } from "almin";
import { createHatebu } from "../domain/Hatebu/HatebuFactory.js";
import { HatebuRepository, hatebuRepository } from "../infra/repository/HatebuRepository.js";

export const createCreateHatebuUserUseCase = () => {
    return new CreateHatebuUserUseCase({
        hatebuRepository
    });
};

export class CreateHatebuUserUseCase extends UseCase {
    constructor(private repo: { hatebuRepository: HatebuRepository }) {
        super();
    }

    execute(userName: string) {
        const existingHatebu = this.repo.hatebuRepository.findByUserName(userName);
        if (existingHatebu) {
            throw new Error(`Hatebu(${userName}) is already created`);
        }
        const hatebu = createHatebu(userName);
        return this.repo.hatebuRepository.save(hatebu);
    }
}
