import axios , {  AxiosRequestHeaders,}from "axios";
import { encryptPayload, decryptPayload, skipEncryptionEndpoints } from "../utils/crypto";
import { clearTokens, getTokens, saveTokens } from '../utils/cookie';


const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

// Create an Axios instance
const apiClient = axios.create({
    baseURL: "https://qa-api.endl.xyz/api/v1", // Adjust your API base URL
    headers: {
      "Content-Type": "application/json",
    },
});

// Request Interceptor
apiClient.interceptors.request.use((config) => {
    if (!SECRET_KEY) throw new Error("SECRET_KEY is missing in environment variables");

    const shouldSkipEncryption = skipEncryptionEndpoints.some(endpoint =>
        config.url?.includes(endpoint)
    );

    if (!shouldSkipEncryption && config.data) {
        try {
            const encryptedPayload = encryptPayload(config.data, SECRET_KEY);
            config.data = { encryptedPayload };
        } catch (error) {
            console.error("Encryption Error:", error);
        }
    }

    const { token } = getTokens();
    if (token) {
      config.headers = Object.assign(config.headers || {}, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      });
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor
apiClient.interceptors.response.use((response) => {
    if (!SECRET_KEY) throw new Error("SECRET_KEY is missing in environment variables");

    const shouldSkipDecryption = skipEncryptionEndpoints.some(endpoint =>
        response.config.url?.includes(endpoint)
    );

    if (!shouldSkipDecryption && response.data?.response) {
           
        try {
            const decryptedResponse = decryptPayload(response.data.response, SECRET_KEY);

          if(decryptedResponse.data && response.config.url === "/user/login")
          saveTokens(decryptedResponse.data?.userId, decryptedResponse.data?.token )
            
          if (
            response.config.url === "/user/logout"
          ) {
            clearTokens()
          }
            return { ...response, data: decryptedResponse };
        } catch (error) {
            console.error("Decryption Error:", error);
            return Promise.reject(error);
        }
    }

    return response;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
