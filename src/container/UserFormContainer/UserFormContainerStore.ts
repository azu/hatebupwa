import { Payload, Store } from "almin";

export interface UserFormContainerState {
    name?: string;
}

export class UserFormContainerStore extends Store<UserFormContainerState> {
    state: UserFormContainerState;

    constructor() {
        super();
        this.state = {
            name: undefined
        };
    }

    getState(): UserFormContainerState {
        return this.state;
    }

    receivePayload(payload: Payload): void {}
}
