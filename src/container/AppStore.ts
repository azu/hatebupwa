import { Payload, Store } from "almin";

export interface AppState {}

export class AppStore extends Store<AppState> {
    state: AppState;

    getState(): AppState {
        return this.state;
    }

    receivePayload(payload: Payload): void {}
}
