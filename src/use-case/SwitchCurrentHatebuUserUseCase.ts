import { Payload, UseCase } from "almin";

export const createSwitchCurrentHatebuUserUseCase = () => {
    return new SwitchCurrentHatebuUserUseCase();
};

export class SwitchCurrentHatebuUserUseCasePayload extends Payload {
    type = "SwitchCurrentHatebuUserUseCase";

    constructor(public userName: string) {
        super();
    }
}

export class SwitchCurrentHatebuUserUseCase extends UseCase {
    execute(userName: string) {
        this.dispatch(new SwitchCurrentHatebuUserUseCasePayload(userName));
    }
}
