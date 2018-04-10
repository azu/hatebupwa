import { Payload, Store } from "almin";
import {
    FailToFetchHatenaBookmarkPayload,
    FinishFetchHatenaBookmarkPayload,
    StartFetchHatenaBookmarkPayload
} from "../use-case/hatebu-api/FetchHatenaBookmarkPayload";

export interface AppState {
    isFetching: boolean;
}

export class AppStore extends Store<AppState> {
    state: AppState;

    constructor() {
        super();
        this.state = {
            isFetching: false
        };
    }

    getState(): AppState {
        return this.state;
    }

    receivePayload(payload: Payload): void {
        if (payload instanceof StartFetchHatenaBookmarkPayload) {
            this.setState({
                ...(this.state as AppState),
                isFetching: true
            });
        } else if (payload instanceof FinishFetchHatenaBookmarkPayload) {
            this.setState({
                ...(this.state as AppState),
                isFetching: false
            });
        } else if (payload instanceof FailToFetchHatenaBookmarkPayload) {
            this.setState({
                ...(this.state as AppState),
                isFetching: false
            });
        }
    }
}
