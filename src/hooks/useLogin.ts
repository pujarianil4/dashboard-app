import { useMutation } from "@tanstack/react-query";
import { login } from '../api/auth';


interface LoginPayload {
  email: string;
  password: string;
}

export const useLogin = () => {
  return useMutation<unknown, Error, LoginPayload>({
    mutationFn: login,
  });
};