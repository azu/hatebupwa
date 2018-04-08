import { UseCase } from "almin";
import { fetchHatenaBookmark } from "../infra/API/HatenaBookmarkFetcher";
import { HatebuRepository, hatebuRepository } from "../infra/repository/HatebuRepository";
import { convertItems } from "../domain/Hatebu/BookmarkItemFactory";

export const createFetchHatenaBookmarkUseCase = () => {
    return new FetchHatenaBookmarkUseCase({
        hatebuRepository
    });
};

export class FetchHatenaBookmarkUseCase extends UseCase {
    constructor(private repo: { hatebuRepository: HatebuRepository }) {
        super();
    }

    execute(userName: string) {
        const hatebu = this.repo.hatebuRepository.findByUserName(userName);
        if (!hatebu) {
            throw new Error("Hatebu user should be created before fetch.");
        }
        return fetchHatenaBookmark(userName).then(bookmarkRawItems => {
            const updatedHatebu = hatebu.updateBookmarkFromItems(convertItems(bookmarkRawItems));
            this.repo.hatebuRepository.save(updatedHatebu);
        });
    }
}
