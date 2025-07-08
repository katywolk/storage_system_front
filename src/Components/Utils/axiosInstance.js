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

export default API;