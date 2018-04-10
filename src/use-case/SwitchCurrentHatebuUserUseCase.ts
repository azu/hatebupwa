import { Payload, UseCase } from "almin";
import { AppSessionRepository, appSessionRepository } from "../infra/repository/AppSessionRepository";
import { HatebuRepository, hatebuRepository } from "../infra/repository/HatebuRepository";

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
        this.dispatch(new SwitchCurrentHatebuUserUseCasePayload(userName));
        // TODO: FIXME history handling
        if (typeof history !== "undefined") {
            history.pushState({}, userName, `/user/${encodeURIComponent(userName)}`);
        }
        const appSession = this.repo.appSessionRepository.get();
        const hatebu = this.repo.hatebuRepository.findByUserName(userName);
        if (hatebu) {
            const newSession = appSession.setCurrentUsedHatebu(hatebu);
            await this.repo.appSessionRepository.save(newSession);
        }
    }
}
