import { Entity, Identifier, Serializer } from "ddd-base";
import { Hatebu, HatebuIdentifier } from "../Hatebu/Hatebu";

export const AppSessionConverter: Serializer<AppSession, AppSessionJSON> = {
    toJSON(entity) {
        return {
            id: entity.props.id.toValue(),
            hatebuId: entity.props.hatebuId ? entity.props.hatebuId.toValue() : undefined
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

export class AppSession extends Entity<AppSessionProps> {
    constructor(args: AppSessionProps) {
        super(args);
    }

    get currentHatebuId() {
        return this.props.hatebuId;
    }

    setCurrentUsedHatebu(hatebu: Hatebu) {
        return new AppSession({
            ...this.props,
            hatebuId: hatebu.props.id
        });
    }
}
