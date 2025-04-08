
// Bangumi API
export const BANGUMI_SUBJECT_API = (id) => `https://api.bgm.tv/v0/subjects/${id}`;
export const BANGUMI_SEARCH_API = (keyword) => `https://api.bgm.tv/search/subject/${encodeURIComponent(keyword)}`;
export const BANGUMI_USER_API = (username) => `https://api.bgm.tv/v0/users/${username}`;
export const BANGUMI_SUBJECT = (id) => `https://bgm.tv/subject/${id}`;
export const BANGUMI_USER_COLLECTION = (fetchID) => `https://api.bgm.tv/v0/users/${fetchID}/collections?subject_type=2`;

// App API
export const API_HELLO = '/api/hello';
export const API_ANIME_SIM = `/api/anime/similarity/:id`;
export const API_USER_REC = `/api/user/recommend/:id`;

