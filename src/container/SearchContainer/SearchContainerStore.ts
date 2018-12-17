import { Payload, Store } from "almin";
import { HatebuRepository } from "../../infra/repository/HatebuRepository";
import { BookmarkItem } from "../../domain/Hatebu/BookmarkItem";
import { SwitchCurrentHatebuUserUseCasePayload } from "../../use-case/SwitchCurrentHatebuUserUseCase";
import { FocusFilterTextFieldUseCasePayload } from "../../use-case/FocusFilterTextFieldUseCase";

export interface HatebuSearchListItem extends BookmarkItem {}

export interface SearchContainerState {
    name: string | undefined;
    items: HatebuSearchListItem[];
    totalCount: number;
    focusTextFieldSymbol: Symbol | undefined;
}

export interface SearchContainerStoreArgs {
    hatebuRepository: HatebuRepository;
}

export class SearchContainerStore extends Store<SearchContainerState> {
    state: SearchContainerState;
    private hatebuRepository: HatebuRepository;

    constructor(args: SearchContainerStoreArgs) {
        super();
        this.state = {
            name: undefined,
            totalCount: 0,
            items: [],
            focusTextFieldSymbol: undefined
        };
        this.hatebuRepository = args.hatebuRepository;
        this.hatebuRepository.events.onChange(() => {
            const hatebu = this.hatebuRepository.get();
            if (!hatebu) {
                return;
            }
            this.setState({
                ...this.state,
                name: this.state.name,
                items: hatebu.bookmarkItems,
                totalCount: hatebu.bookmarkTotalCount
            });
        });
    }

    getState(): SearchContainerState {
        return this.state;
    }

    receivePayload(payload: Payload) {
        if (payload instanceof SwitchCurrentHatebuUserUseCasePayload) {
            const hatebu = this.hatebuRepository.findByUserName(payload.userName);
            if (!hatebu) {
                return;
            }
            this.setState({
                ...this.state,
                name: hatebu.name,
                items: hatebu.bookmarkItems,
                totalCount: hatebu.bookmarkTotalCount
            });
        } else if (payload instanceof FocusFilterTextFieldUseCasePayload) {
            this.setState({
                ...this.state,
                focusTextFieldSymbol: Symbol()
            });
        }
    }
}
