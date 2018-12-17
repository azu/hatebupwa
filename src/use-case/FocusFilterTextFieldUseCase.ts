import { Payload, UseCase } from "almin";

export class FocusFilterTextFieldUseCasePayload extends Payload {
    type = "FocusFilterTextFieldUseCasePayload";
}

export class FocusFilterTextFieldUseCase extends UseCase {
    execute() {
        this.dispatch(new FocusFilterTextFieldUseCasePayload());
    }
}
