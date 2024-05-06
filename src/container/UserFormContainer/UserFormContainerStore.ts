import { Payload, Store } from "almin";
import { HatebuRepository } from "../../infra/repository/HatebuRepository.js";
import { SwitchCurrentHatebuUserUseCasePayload } from "../../use-case/SwitchCurrentHatebuUserUseCase.js";

export interface UserFormContainerState {
    name?: string;
}

export interface UserFormContainerStoreArgs {
    hatebuRepository: HatebuRepository;
}

export class UserFormContainerStore extends Store<UserFormContainerState> {
    state: UserFormContainerState;

    constructor(private args: UserFormContainerStoreArgs) {
        super();
        this.state = {
            name: undefined
        };
    }

    getState(): UserFormContainerState {
        return this.state;
    }

    receivePayload(payload: Payload): void {
        if (payload instanceof SwitchCurrentHatebuUserUseCasePayload) {
            const hatebu = this.args.hatebuRepository.findByUserName(payload.userName);
            if (!hatebu) {
                return;
            }
            this.setState({
                name: hatebu.name
            });
        }
    }
}
