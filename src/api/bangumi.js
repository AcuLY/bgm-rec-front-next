import axios from "axios";
import { BANGUMI_SEARCH_API, BANGUMI_SUBJECT_API } from "./_prefix";
import {BANGUMI_USER_COLLECTION} from "../../config/api.js";


const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const searchAnimeByKeyword = async(keyword, start=0) => {
    try {
        const encodedKeyword = encodeURIComponent(keyword)
        const resp = await axios.get(BANGUMI_SEARCH_API(encodedKeyword), {
            params: {
                type: 2,
                responseGroup: 'small',
                start: Number(start),
                max_results: 24
            }
        })

        return resp.data.list
    } catch (error) {
        return []
    }
}

export const getAnimeInfo = async(id) => {
    try {
        const url = BANGUMI_SUBJECT_API(String(id))
        const resp = await axios.get(url)
        const data = resp.data
        return {
            id: String(id),
            name: data.name,
            nameCN: data.name_cn,
            image: data.images['large'],
            tags: data.meta_tags,
            summary: data.summary,
            score: data.rating['score'],
            date: data.date
        }
    } catch (error) {
        throw new Error('获取条目信息失败：' + error.message);
    }
}

export const fetchUserCollections = async (fetchId, fetchType = 0) => {
    try {
        const cacheKey = `bgm-rec-next-${fetchId}-${fetchType === 0 ? 'all' : fetchType}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
            const { data: cacheData, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_EXPIRY) {
                return {
                    data: cacheData,
                    total: Object.values(cacheData).reduce((acc, list) => acc + list.length, 0),
                };
            }
        }

        const collectionTypes = fetchType === 0 ? [1, 2, 3, 4, 5] : [fetchType];
        const collectionTypeLabels = {
            1: "doing",
            2: "collect",
            3: "wish",
            4: "onhold",
            5: "dropped",
        };
        const groupedData = {
            doing: [],
            collect: [],
            wish: [],
            onhold: [],
            dropped: [],
        };

        for (const collectionType of collectionTypes) {
            let offset = 0;
            const limit = 40;
            let hasMore = true;

            while (hasMore) {
                const url = new URL(BANGUMI_USER_COLLECTION(fetchId));
                url.searchParams.append("type", collectionType.toString());
                url.searchParams.append("limit", limit.toString());
                url.searchParams.append("offset", offset.toString());

                const response = await axios.get(url.toString(), {
                    headers: {
                        "User-Agent": "bgm-rec-next/1.0",
                    },
                });

                if (response.status !== 200) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const json = response.data;
                const labeledData = json.data.map((item) => ({
                    ...item,
                    collectionTypeLabel: collectionTypeLabels[collectionType],
                }));

                groupedData[collectionTypeLabels[collectionType]] = [
                    ...groupedData[collectionTypeLabels[collectionType]],
                    ...labeledData,
                ];

                hasMore = json.data.length >= limit;
                offset += limit;
            }
        }

        localStorage.setItem(
            cacheKey,
            JSON.stringify({
                data: groupedData,
                timestamp: Date.now(),
            })
        );

        return {
            data: groupedData,
            total: Object.values(groupedData).reduce((acc, list) => acc + list.length, 0),
        };
    } catch (error) {
        throw new Error("Failed to fetch user collections: " + error.message);
    }
};