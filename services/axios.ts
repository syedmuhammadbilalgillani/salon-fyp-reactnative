import Axios, { AxiosInstance } from "axios";
import { configure } from "axios-hooks";
import * as SecureStore from "expo-secure-store";
import { LRUCache } from "lru-cache";

// Cache for Axios hooks
const cache = new LRUCache({ max: 10 });

export let axiosApi: AxiosInstance;

// Type definition for initialization parameters
type ApiConfigParams = {
  isLoggedIn?: boolean;
  token?: string | null;
};

// Initialize Axios API
export const initAxiosApi = async (params: ApiConfigParams) => {
  const { isLoggedIn = false, token = null } = params;

  // Save token to SecureStore if provided
  if (isLoggedIn && token) {
    await SecureStore.setItemAsync("authToken", token);
  } else if (!isLoggedIn) {
    // Clear token on logout
    await SecureStore.deleteItemAsync("authToken");
  }

  // Create Axios instance
  axiosApi = Axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_API_URL}`,
    timeout: 60000, // 60 seconds
    params: {
      is_mobile: true,
    },
    headers: {
      ...(isLoggedIn && token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // Configure Axios hooks
  configure({ axios: axiosApi, cache });

  // Add request interceptor for secure token inclusion
  axiosApi.interceptors.request.use(async (config) => {
    const storedToken = await SecureStore.getItemAsync("authToken");
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }
    return config;
  });

  // Add response interceptor to handle errors or token refresh logic
  axiosApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        console.error("Unauthorized request, logging out...");
        await SecureStore.deleteItemAsync("authToken");
        // You might want to redirect the user to the login screen here
      }
      return Promise.reject(error);
    }
  );
};
