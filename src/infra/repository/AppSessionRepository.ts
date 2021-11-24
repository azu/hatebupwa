import { NonNullableRepository } from "ddd-base";
import { AppSession, AppSessionConverter, AppSessionJSON } from "../../domain/AppSession/AppSession";
import { createStorageInstance } from "./StorageManger";
import { createAppSession } from "../../domain/AppSession/AppSessionFactory";

export class AppSessionRepository extends NonNullableRepository<AppSession> {
    private storage: LocalForage;

    constructor(initialEntity: AppSession) {
        super(initialEntity);
        this.storage = createStorageInstance({
            name: "AppSessionRepository"
        });
    }

    /**
     * Please call this before find* API
     * @returns {Promise<any>}
     */
    async ready(): Promise<AppSession | null> {
        if (this.map.size > 0) {
            return Promise.resolve(null);
        }
        await this.storage.ready();
        const values: AppSessionJSON[] = [];
        await this.storage.iterate<AppSessionJSON, void>((value) => {
            values.push(value);
        });
        const entities = values.map((json) => {
            return AppSessionConverter.fromJSON(json);
        });
        entities.forEach((entity) => {
            this.map.set(entity.props.id.toValue(), entity);
        });
        // TODO: NonNullableRepository should have set lastUsed Value
        if (entities.length === 0) {
            return null;
        }
        this.save(entities[0]);
        return entities[0];
    }

    save(entity: AppSession) {
        // AppSession can treat a single session
        super.save(entity);
        return this.storage.setItem(entity.props.id.toValue(), AppSessionConverter.toJSON(entity));
    }
}

export const appSessionRepository = new AppSessionRepository(createAppSession());
