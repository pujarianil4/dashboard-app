import apiClient from '../configs/axiosInstance';

interface LoginPayload {
  email: string;
  password: string;
}


export const login = async (data: LoginPayload): Promise<unknown> =>
  (await apiClient.post("/user/login", data)).data;


export const logout = async (): Promise<unknown> =>
  (await apiClient.post("/user/logout")).data;