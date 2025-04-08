import {
  BANGUMI_SUBJECT_API,
  BANGUMI_SEARCH_API,
  BANGUMI_SUBJECT,
  API_ANIME_SIM,
  API_USER_REC
} from "../../config/api.js";

const isMockMode = import.meta.env.VITE_MODE === 'development';

// BASE URLs
export const BASE_PRODUCE = `${window.location.origin}`;
export const BASE_MOCK = 'http://127.0.0.1:3000'
export const BASE_API_URL = isMockMode ? BASE_MOCK : BASE_PRODUCE

export const URL_ANIME_SIM = (id) => `${BASE_API_URL}${API_ANIME_SIM.replace(
    ':id', id)}`;

export const URL_USER_REC = (id) => `${BASE_API_URL}${API_USER_REC.replace(
    ':id', id)}`;

export {
  BANGUMI_SUBJECT_API,
  BANGUMI_SEARCH_API,
  BANGUMI_SUBJECT,
};