import axios from "axios";
import { SIMILAR_ANIME_API } from "./_prefix";

export const getSimilarAnime = async (id) => {
    try {
        const url = SIMILAR_ANIME_API + `/${id}`
        const resp =  await axios.get(url)
        return resp.data
    } catch (error) {
        if (error.response && error.response.status == '404') {
            throw new Error('该条目不是动画或暂无数据')
        }
        throw error 
    }
}