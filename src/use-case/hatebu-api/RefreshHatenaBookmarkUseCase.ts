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
export const createRefreshHatenaBookmarkUseCase = () => {
    return new RefreshHatenaBookmarkUseCase({
        hatebuRepository
    });
};

export class RefreshHatenaBookmarkUseCase extends UseCase {
    constructor(private repo: { hatebuRepository: HatebuRepository }) {
        super();
    }

    execute(userName: string) {
        const hatebu = this.repo.hatebuRepository.findByUserName(userName);
        if (!hatebu) {
            throw new Error("Hatebu user should be created before fetch.");
        }
        const lastUpdatedDate = hatebu.props.bookmark.props.lastUpdated;
        debug(
            "start fetching items since %s",
            lastUpdatedDate.isInitialDate ? "initial date" : lastUpdatedDate.toUTCString()
        );
        this.dispatch(new StartFetchHatenaBookmarkPayload());
        return fetchHatenaBookmark(userName, lastUpdatedDate)
            .then(async bookmarkRawItems => {
                debug("finish fetching items(%s) and add items to list", bookmarkRawItems.length);
                const updatedHatebu = hatebu.addBookmarkItems(convertItems(bookmarkRawItems));
                await this.repo.hatebuRepository.save(updatedHatebu);
                this.dispatch(new FinishFetchHatenaBookmarkPayload());
            })
            .catch(error => {
                this.dispatch(new FailToFetchHatenaBookmarkPayload(error));
            });
    }
}
