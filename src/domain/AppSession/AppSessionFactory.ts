import { AppSession, AppSessionIdentifier } from "./AppSession.js";
import { ulid } from "ulid";

export const createAppSession = () => {
    return new AppSession({
        id: new AppSessionIdentifier(ulid()),
        hatebuId: undefined
    });
};
