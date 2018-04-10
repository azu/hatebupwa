import { Entity, Identifier, Serializer } from "ddd-base";
import { Hatebu, HatebuIdentifier } from "../Hatebu/Hatebu";

export const AppSessionConverter: Serializer<AppSession, AppSessionJSON> = {
    toJSON(entity) {
        return {
            id: entity.id.toValue(),
            hatebuId: entity.hatebuId ? entity.hatebuId.toValue() : undefined
        };
    },
    fromJSON(json) {
        return new AppSession({
            id: new AppSessionIdentifier(json.id),
            hatebuId: json.hatebuId ? new HatebuIdentifier(json.hatebuId) : undefined
        });
    }
};

export class AppSessionIdentifier extends Identifier<string> {}

export interface AppSessionJSON {
    id: string;
    hatebuId?: string;
}

export interface AppSessionProps {
    id: AppSessionIdentifier;
    hatebuId?: HatebuIdentifier;
}

export class AppSession extends Entity<AppSessionIdentifier> {
    hatebuId?: HatebuIdentifier;

    constructor(args: AppSessionProps) {
        super(args.id);
        this.hatebuId = args.hatebuId;
    }

    get currentHatebuId() {
        return this.hatebuId;
    }

    setCurrentUsedHatebu(hatebu: Hatebu) {
        return new AppSession({
            ...(this as AppSessionProps),
            hatebuId: hatebu.id
        });
    }
}
