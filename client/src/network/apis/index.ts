import axios, { isAxiosError } from "axios";

export const API = axios.create({
    baseURL: import.meta.env.VITE_ENTRYPOINT_URL,
    withCredentials: true,
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (isAxiosError(error)) {
            if (!error.response) {
                error.message = "Unable to connect to the server. Please check your internet connection.";
            } else if (error.code === "ECONNABORTED") {
                error.message = "Request timed out. Please try again.";
            } else if (error.response.status === 401 && !window.location.pathname.includes("/auth")) {
                window.location.href = "/auth/login";
            }
        }

        throw error;
    }
);
