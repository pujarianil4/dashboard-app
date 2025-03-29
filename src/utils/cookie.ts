import Cookies from "js-cookie";
import { decryptToken, encryptToken } from './crypto';

// Save encrypted tokens in cookies
export const saveTokens = (id: string, token: string): void => {
  Cookies.set("id", id, { path: "/" });
  Cookies.set("token", encryptToken(token), { path: "/" });
};

// Retrieve and decrypt token details from cookies
export const getTokens = (): { id: string | null; token: string | null } => {
  const id = Cookies.get("id");
  const encryptedToken = Cookies.get("token");
  const token = encryptedToken ? decryptToken(encryptedToken) : null;
  return { id: id || null, token };
};

// Clear tokens from cookies
export const clearTokens = (): void => {
  Cookies.remove("id");
  Cookies.remove("token");
};