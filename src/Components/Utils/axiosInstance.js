import axios from "axios";
import {getBackendUrl} from "../../utils";

const API = axios.create({
    baseURL: getBackendUrl()+'/api/',
});

// Подключаем токен ко всем запросам
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // или откуда ты берёшь токен
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

API.interceptors.response.use(response => {
    return response;
}, error => {
    console.error('[AXIOS_ERROR]', error);
    if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }
    return Promise.reject(error);
});

export default API;