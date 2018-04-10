import { UseCase } from "almin";
import { fetchHatenaBookmark } from "../../infra/API/HatenaBookmarkFetcher";
import { HatebuRepository, hatebuRepository } from "../../infra/repository/HatebuRepository";
import { convertItems } from "../../domain/Hatebu/BookmarkItemFactory";

const debug = require("debug")("hatebu-pwa");
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
        return fetchHatenaBookmark(userName).then(bookmarkRawItems => {
            debug("finish fetching items(%s)", bookmarkRawItems.length);
            const updatedHatebu = hatebu.updateBookmarkItems(convertItems(bookmarkRawItems));
            return this.repo.hatebuRepository.save(updatedHatebu);
        });
    }
}
