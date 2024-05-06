import { UseCase } from "almin";
import { fetchHatenaBookmark } from "../../infra/API/HatenaBookmarkFetcher.js";
import { HatebuRepository, hatebuRepository } from "../../infra/repository/HatebuRepository.js";
import { convertItems } from "../../domain/Hatebu/BookmarkItemFactory.js";
import {
    FailToFetchHatenaBookmarkPayload,
    FinishFetchHatenaBookmarkPayload,
    StartFetchHatenaBookmarkPayload
} from "./FetchHatenaBookmarkPayload.js";

import debug0 from "debug";

const debug = debug0("hatebupwa");
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
            .then(async (bookmarkRawItems) => {
                debug("finish fetching items(%s) and update list with items", bookmarkRawItems.length);
                const updatedHatebu = hatebu.updateBookmarkItems(convertItems(bookmarkRawItems));
                await this.repo.hatebuRepository.save(updatedHatebu);
                this.dispatch(new FinishFetchHatenaBookmarkPayload());
            })
            .catch((error) => {
                this.dispatch(new FailToFetchHatenaBookmarkPayload(error));
            });
    }
}
