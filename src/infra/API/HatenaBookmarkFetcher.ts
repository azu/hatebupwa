import { RawHatenaBookmark } from "../../domain/Hatebu/BookmarkItemFactory";
import { BookmarkDate } from "../../domain/Hatebu/BookmarkDate";

const format = require("date-fns/format");
const parse = require("hatebu-mydata-parser").parse;
export const fetchHatenaBookmark = (userName: string, sinceTime?: BookmarkDate): Promise<RawHatenaBookmark[]> => {
    const timeStamp = sinceTime ? `timestamp=${format(sinceTime.date, "YYYYMMDDHHmmss")}` : "";

    return fetch(`/hatebu/${encodeURIComponent(userName)}/search.data?${timeStamp}`)
        .then((res: any) => {
            if (!res.ok) {
                return Promise.reject(new Error("Can not fetch"));
            }
            return res.text();
        })
        .then(text => {
            return parse(text);
        });
};
