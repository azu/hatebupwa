import { Payload, UseCase } from "almin";
import { AppSessionRepository, appSessionRepository } from "../infra/repository/AppSessionRepository";
import { HatebuRepository, hatebuRepository } from "../infra/repository/HatebuRepository";
import { browserHistory } from "../infra/browser/browserHistory";
import { History } from "history";

const debug = require("debug")("hatebu-pwa:SwitchCurrentHatebuUserUseCase");

export const createSwitchCurrentHatebuUserUseCase = () => {
    return new SwitchCurrentHatebuUserUseCase({
        appSessionRepository,
        hatebuRepository,
        browserHistory
    });
};

export class SwitchCurrentHatebuUserUseCasePayload extends Payload {
    type = "SwitchCurrentHatebuUserUseCase";

    constructor(public userName: string) {
        super();
    }
}

export class SwitchCurrentHatebuUserUseCase extends UseCase {
    private browserHistory: History;

    constructor(
        private repo: {
            appSessionRepository: AppSessionRepository;
            hatebuRepository: HatebuRepository;
            browserHistory: History;
        }
    ) {
        super();
        this.browserHistory = repo.browserHistory;
    }

    async execute(userName: string) {
        const hatebu = this.repo.hatebuRepository.findByUserName(userName);
        debug("current hatebu: %o", hatebu);
        this.dispatch(new SwitchCurrentHatebuUserUseCasePayload(userName));
        // TODO: FIXME history handling
        if (this.browserHistory.location.pathname !== `/user/${encodeURIComponent(userName)}`) {
            debug("push pathname %s", browserHistory.location.pathname);
            this.browserHistory.push(`/user/${encodeURIComponent(userName)}`);
        }
        if (hatebu) {
            const appSession = this.repo.appSessionRepository.get();
            const newSession = appSession.setCurrentUsedHatebu(hatebu);
            debug("new session %o", newSession);
            await this.repo.appSessionRepository.save(newSession);
        }
    }
}
