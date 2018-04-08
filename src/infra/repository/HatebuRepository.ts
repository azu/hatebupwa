import { NullableRepository } from "ddd-base";
import { Hatebu, HatebuIdentifier } from "../../domain/Hatebu/Hatebu";

export class HatebuRepository extends NullableRepository<Hatebu> {
    findByUserName(userName: string) {
        return this.findById(new HatebuIdentifier(userName));
    }
}

export const hatebuRepository = new HatebuRepository();
