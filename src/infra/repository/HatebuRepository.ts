import { NullableRepository } from "ddd-base";
import { Hatebu, HatebuConverter, HatebuIdentifier, HatebuJSON } from "../../domain/Hatebu/Hatebu";
import { createStorageInstance } from "./StorageManger";

export class HatebuRepository extends NullableRepository<Hatebu> {
    private storage: LocalForage;

    constructor() {
        super();
        this.storage = createStorageInstance({
            name: "HatebuRepository"
        });
    }

    /**
     * Please call this before find* API
     * @returns {Promise<any>}
     */
    async ready(): Promise<Hatebu | null> {
        if (this.map.size > 0) {
            return Promise.resolve(null);
        }
        await this.storage.ready();
        const values: HatebuJSON[] = [];
        let lastValue: Hatebu | null = null;
        await this.storage.iterate<HatebuJSON, void>(value => {
            values.push(value);
        });
        values
            .map(json => {
                return HatebuConverter.fromJSON(json);
            })
            .forEach(hatebu => {
                this.map.set(hatebu.id.toValue(), hatebu);
                lastValue = hatebu;
            });
        return lastValue;
    }

    findByHatebuId(id?: HatebuIdentifier) {
        return this.findById(id);
    }

    findByUserName(userName: string) {
        return this.findById(new HatebuIdentifier(userName));
    }

    save(entity: Hatebu) {
        super.save(entity);
        return this.storage.setItem(entity.id.toValue(), HatebuConverter.toJSON(entity));
    }
}

export const hatebuRepository = new HatebuRepository();
