import { Store } from "almin";
import { HatebuRepository } from "../../infra/repository/HatebuRepository";
import { BookmarkItem } from "../../domain/Hatebu/BookmarkItem";

export interface HatebuSearchListItem extends BookmarkItem {}

export interface SearchContainerState {
    items: HatebuSearchListItem[];
    totalCount: number;
}

export interface SearchContainerStoreArgs {
    hatebuRepository: HatebuRepository;
}

export class SearchContainerStore extends Store<SearchContainerState> {
    state: SearchContainerState;

    constructor(args: SearchContainerStoreArgs) {
        super();
        this.state = {
            totalCount: 0,
            items: []
        };
        const hatebuRepository = args.hatebuRepository;
        hatebuRepository.events.onChange(() => {
            const hatebu = hatebuRepository.get();
            if (!hatebu) {
                return;
            }
            this.setState({
                items: hatebu.bookmark.items,
                totalCount: hatebu.bookmark.items.length
            });
        });
    }

    getState(): SearchContainerState {
        return this.state;
    }
}
