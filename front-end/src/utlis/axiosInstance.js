import axios from "axios";

const axiosInstance = axios.create({});

axiosInstance.interceptors.request.use(
    (config) => {
        const auth_token = localStorage.getItem("auth_token");
        if (auth_token) config.headers["Authorization"] = `Bearer ${auth_token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const { status } = error.response;
            if (status === 401) {
                window.location.href = "/index";
            } else {
                console.error('Response error:', error);
                return Promise.reject(error);
            }
        } else {
            console.error('Network or other error:', error);
            return Promise.reject(new Error('Network error or no response from server'));
        }
    }
);
export default axiosInstance;