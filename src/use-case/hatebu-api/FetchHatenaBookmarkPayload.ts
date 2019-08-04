import { Payload } from "almin";

export class StartFetchHatenaBookmarkPayload implements Payload {
    type = "StartFetchHatenaBookmarkPayload";
}

export class FinishFetchHatenaBookmarkPayload implements Payload {
    type = "FinishFetchHatenaBookmarkPayload";
}

export class FailToFetchHatenaBookmarkPayload implements Payload {
    type = "FailToFetchHatenaBookmarkPayload";

    constructor(public error: Error) {}
}
