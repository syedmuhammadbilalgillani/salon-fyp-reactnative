import { axiosApi, initAxiosApi } from "@/services/axios";
import { LoginRequest, RegisterRequest, RegisterResponse } from "@/types";

export const registerUser = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  // Ensure axiosApi is initialized (if not already done)
  if (!axiosApi || !axiosApi.defaults.baseURL) {
    await initAxiosApi({ isLoggedIn: false });
  }
  
  const response = await axiosApi.post<RegisterResponse>(
    "/api/auth/register",
    data
  );
  return response.data;
};
export const loginUser = async (
  data: LoginRequest
): Promise<RegisterResponse> => {
  // Ensure axiosApi is initialized (if not already done)
  if (!axiosApi || !axiosApi.defaults.baseURL) {
    await initAxiosApi({ isLoggedIn: false });
  }
  
  const response = await axiosApi.post<RegisterResponse>(
    "/api/auth/login",
    data
  );
  return response.data;
};