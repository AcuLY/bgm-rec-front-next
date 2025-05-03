import axios from "axios";
import pLimit from 'p-limit'
import { BANGUMI_SEARCH_API, BANGUMI_SUBJECT_API } from "./_prefix";
import { BANGUMI_USER_API, BANGUMI_USER_COLLECTION } from "../../config/api.js";


const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const searchAnimeByKeyword = async (keyword, start = 0) => {
    try {
        const resp = await axios.get(BANGUMI_SEARCH_API(keyword), {
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

export const getAnimeInfo = async (id) => {
    try {
        const url = BANGUMI_SUBJECT_API(String(id))
        const resp = await axios.get(url)
        const data = resp.data
        if (data.type != 2) {
            throw new Error("该条目不是动画")
        }
        return {
            id: String(id),
            name: data.name,
            nameCN: data.name_cn,
            image: data.images['large'],
            tags: data.meta_tags,
            summary: data.summary,
            score: data.rating['score'],
            rank: data.rating['rank'],
            total: data.rating['total'],
            date: data.date
        }
    } catch (error) {
        throw new Error('获取条目信息失败：' + error.message);
    }
}

export const getUserInfo = async (username) => {
    try {
        const url = BANGUMI_USER_API(username)
        const resp = await axios.get(url)
        const data = resp.data
        return {
            id: data.id,
            nickname: data.nickname
        }
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error('请输入正确的用户名')
        }
        throw new Error('获取用户信息失败：' + error.message);
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
            1: "wish",
            2: "collect",
            3: "doing",
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
            const limit = 50;
            let hasMore = true;

            while (hasMore) {
                const url = new URL(BANGUMI_USER_COLLECTION(fetchId));
                url.searchParams.append("type", collectionType.toString());
                url.searchParams.append("limit", limit.toString());
                url.searchParams.append("offset", offset.toString());

                const response = await axios.get(url.toString());

                if (response.status !== 200) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const json = response.data;

                const labeledData = json.data.map((item) => item.subject_id);

                groupedData[collectionTypeLabels[collectionType]].push(...labeledData);

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
