import axios from "axios";
import { BANGUMI_SEARCH_API, BANGUMI_SUBJECT_API } from "./_prefix";

export const searchAnimeByKeyword = async(keyword, start=0) => {
    try {
        const encodedKeyword = encodeURIComponent(keyword)
        const resp = await axios.get(BANGUMI_SEARCH_API + `/${encodedKeyword}`, {
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
        const url = BANGUMI_SUBJECT_API + `/${String(id)}`
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