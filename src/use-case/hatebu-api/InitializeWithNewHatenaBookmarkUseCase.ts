import { UseCase } from "almin";
import { fetchHatenaBookmark } from "../../infra/API/HatenaBookmarkFetcher";
import { HatebuRepository, hatebuRepository } from "../../infra/repository/HatebuRepository";
import { convertItems } from "../../domain/Hatebu/BookmarkItemFactory";
import {
    FailToFetchHatenaBookmarkPayload,
    FinishFetchHatenaBookmarkPayload,
    StartFetchHatenaBookmarkPayload
} from "./FetchHatenaBookmarkPayload";

const debug = require("debug")("hatebupwa");
export const createFetchInitialHatenaBookmarkUseCase = () => {
    return new InitializeWithNewHatenaBookmarkUseCase({
        hatebuRepository
    });
};

export class InitializeWithNewHatenaBookmarkUseCase extends UseCase {
    constructor(private repo: { hatebuRepository: HatebuRepository }) {
        super();
    }

    execute(userName: string) {
        const hatebu = this.repo.hatebuRepository.findByUserName(userName);
        if (!hatebu) {
            throw new Error("Hatebu user should be created before fetch.");
        }
        debug("start fetching items for initializing");
        this.dispatch(new StartFetchHatenaBookmarkPayload());
        return fetchHatenaBookmark(userName)
            .then(async bookmarkRawItems => {
                debug("finish fetching items(%s)", bookmarkRawItems.length);
                const updatedHatebu = hatebu.updateBookmarkItems(convertItems(bookmarkRawItems));
                await this.repo.hatebuRepository.save(updatedHatebu);
                this.dispatch(new FinishFetchHatenaBookmarkPayload());
            })
            .catch(error => {
                this.dispatch(new FailToFetchHatenaBookmarkPayload(error));
            });
    }
}
