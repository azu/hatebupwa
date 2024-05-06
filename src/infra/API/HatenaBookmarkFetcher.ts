import { RawHatenaBookmark } from "../../domain/Hatebu/BookmarkItemFactory.js";
import { BookmarkDate } from "../../domain/Hatebu/BookmarkDate.js";
import format from "date-fns/format";
// @ts-expect-error no types
import { parse } from "hatebu-mydata-parser";
type AsocialBookmarkItem = import("asocial-bookmark").AsocialBookmarkItem;
export const fetchHatenaBookmark = (userName: string, sinceTime?: BookmarkDate): Promise<RawHatenaBookmark[]> => {
    // Support asocial-bookmark https://github.com/azu/asocial-bookmark
    // TODO: undocument ways
    const isURL = /^https?:\/\//.test(userName);
    if (isURL) {
        return fetch(userName)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Can not fetch");
                }
                return res.json();
            })
            .then((json: AsocialBookmarkItem[]) => {
                return json.map((item) => {
                    return {
                        title: item.title,
                        comment: item.content,
                        url: item.url,
                        date: new Date(item.date)
                    };
                });
            });
    }
    const timeStamp = sinceTime ? `timestamp=${format(sinceTime.date, "YYYYMMDDHHmmss")}` : "";
    return fetch(`/hatebu/${encodeURIComponent(userName)}/search.data?${timeStamp}`)
        .then((res: any) => {
            if (!res.ok) {
                return Promise.reject(new Error("Can not fetch"));
            }
            return res.text();
        })
        .then((text) => {
            return parse(text);
        });
};
