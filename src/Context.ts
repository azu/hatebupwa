import { Context, StoreGroup } from "almin";
import { UserFormContainerStore } from "./container/UserFormContainer/UserFormContainerStore";
import { SearchContainerStore } from "./container/SearchContainer/SearchContainerStore";
import { AlminLogger } from "almin-logger";
import { createContext } from "./AlminContext";
import { hatebuRepository } from "./infra/repository/HatebuRepository";
import { AppStore } from "./container/AppStore";

export const AppStoreGroup = new StoreGroup({
    userFormContainer: new UserFormContainerStore({
        hatebuRepository
    }),
    searchContainer: new SearchContainerStore({
        hatebuRepository
    }),
    app: new AppStore()
});

export const context = new Context({
    store: AppStoreGroup,
    options: {
        strict: false,
        performanceProfile: true
    }
});

if (process.env.NODE_ENV !== "production") {
    const logger = new AlminLogger();
    logger.startLogging(context);
}

const { Provider, Consumer, Subscribe } = createContext(context);
export { Provider, Consumer, Subscribe };
