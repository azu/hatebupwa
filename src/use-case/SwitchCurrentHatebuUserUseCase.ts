import { Payload, UseCase } from "almin";
import { AppSessionRepository, appSessionRepository } from "../infra/repository/AppSessionRepository";
import { HatebuRepository, hatebuRepository } from "../infra/repository/HatebuRepository";
import { browserHistory } from "../infra/browser/browserHistory";

const debug = require("debug")("hatebu-pwa:SwitchCurrentHatebuUserUseCase");

export const createSwitchCurrentHatebuUserUseCase = () => {
    return new SwitchCurrentHatebuUserUseCase({
        appSessionRepository,
        hatebuRepository
    });
};

export class SwitchCurrentHatebuUserUseCasePayload extends Payload {
    type = "SwitchCurrentHatebuUserUseCase";

    constructor(public userName: string) {
        super();
    }
}

export class SwitchCurrentHatebuUserUseCase extends UseCase {
    constructor(private repo: { appSessionRepository: AppSessionRepository; hatebuRepository: HatebuRepository }) {
        super();
    }

    async execute(userName: string) {
        const appSession = this.repo.appSessionRepository.get();
        const hatebu = this.repo.hatebuRepository.findByHatebuId(appSession.currentHatebuId);
        debug("current hatebu: %o", hatebu);
        this.dispatch(new SwitchCurrentHatebuUserUseCasePayload(userName));
        // TODO: FIXME history handling
        debug("pathname %s", browserHistory.location.pathname);
        if (browserHistory.location.pathname !== `/user/${encodeURIComponent(userName)}`) {
            browserHistory.push(`/user/${encodeURIComponent(userName)}`);
        }
        if (hatebu) {
            const newSession = appSession.setCurrentUsedHatebu(hatebu);
            await this.repo.appSessionRepository.save(newSession);
        }
    }
}
