import axios from "axios";
import {URL_ANIME_SIM} from "./_prefix.js";


export const getSimilarAnime = async (id) => {
    try {
        const url = URL_ANIME_SIM(id);
        const resp =  await axios.get(url)
        return resp.data
    } catch (error) {
        if (error.response && error.response.status == '404') {
            throw new Error('该条目不是动画或暂无数据')
        }
        throw error 
    }
}