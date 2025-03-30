import Cookies from "js-cookie";
import { decryptToken, encryptToken } from './crypto';


// Save encrypted tokens in cookies
export const saveTokens = (id: string, token: string, expiryDate: string): void => {
  Cookies.set("id", id, { path: "/" });
  Cookies.set("token", encryptToken(token), { path: "/" });
  Cookies.set("expiryDate", expiryDate, { path: "/" });
};

// Retrieve and decrypt token details from cookies
export const getTokens = (): { id: string | null; token: string | null; expiryDate: string | null } => {
  const id = Cookies.get("id");
  const encryptedToken = Cookies.get("token");
  const expiryDate = Cookies.get("expiryDate");
  const token = encryptedToken ? decryptToken(encryptedToken) : null;
  return { id: id || null, token, expiryDate: expiryDate || null };
};

// Clear tokens from cookies
export const clearTokens = (): void => {
  Cookies.remove("id");
  Cookies.remove("token");
  Cookies.remove("expiryDate");
};