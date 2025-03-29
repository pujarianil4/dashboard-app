import CryptoJS, { AES } from "crypto-js";


interface DecryptPayloadResponse {
    code: number;
    message: string;
    status: "Success" | "Error";
    data: {
      status: boolean;
      message: string;
      token: string;
      userId: string;
      expiryDate: string;
    } | null;
    errors: any;
  }

// Encrypt token before saving to cookies
export const encryptToken = (token: string): string => {
  return AES.encrypt(token, SECRET_KEY.trim()).toString();
};

// Decrypt token function
export const decryptToken = (encryptedToken: string): string | null => {
  try {
    const bytes = AES.decrypt(encryptedToken, SECRET_KEY.trim());
    return bytes.toString(CryptoJS.enc.Utf8) || null;
  } catch (error) {
    console.error("Token decryption failed:", error);
    return null;
  }
};

// Get the secret key from environment variables
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

// Function to derive the AES key (first 16 bytes of SHA-256 hash of the secret key)
const getKey = (secretKey: string): CryptoJS.lib.WordArray => {
    return CryptoJS.enc.Hex.parse(
        CryptoJS.SHA256(secretKey).toString(CryptoJS.enc.Hex).substring(0, 32)
    );
};

// Function to encrypt the payload
export const encryptPayload = (payload: object, secretKey: string): string => {
    const jsonPayload = JSON.stringify(payload);

    if (!jsonPayload || jsonPayload.trim() === '') {
        throw new Error('Invalid payload: Must be a non-empty string.');
    }

    const iv = CryptoJS.lib.WordArray.random(16);
    const key = getKey(secretKey);

    const encrypted = CryptoJS.AES.encrypt(jsonPayload, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    const encryptedDataHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    const combined = CryptoJS.enc.Hex.parse(iv.toString(CryptoJS.enc.Hex) + encryptedDataHex);

    return CryptoJS.enc.Base64.stringify(combined);
};

// Function to decrypt the response payload
export const decryptPayload = (encryptedPayload: string, secretKey: string): DecryptPayloadResponse => {
    const combinedBytes = CryptoJS.enc.Base64.parse(encryptedPayload);
    const combinedHex = combinedBytes.toString(CryptoJS.enc.Hex);

    const ivHex = combinedHex.substring(0, 32);
    const encryptedDataHex = combinedHex.substring(32);

    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const encryptedData = CryptoJS.enc.Hex.parse(encryptedDataHex);

    const key = getKey(secretKey);

    // ✅ Properly create a CipherParams object
    const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: encryptedData,
    });

    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    // return decrypted.toString(CryptoJS.enc.Utf8);

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    const parsedData = JSON.parse(decryptedText);
    console.log("parsedData", parsedData);
    
    return parsedData;
}

// List of endpoints to skip encryption/decryption
export const skipEncryptionEndpoints = [
    "/api/v1/user/profilePicture",
    "/api/v1/user/uploadProfilePicture",
    "/api/v1/recipient/generate/document",
    "/api/v1/txn/invoiceUpload",
    "/api/v1/txn/generate/document",
    "/api/v1/accounts/deposit_address/qr",
    "/api/v1/csp-report",
    "/api/v1/test/health",
    "/health",
    "/api/v1/test/ping",
    "/ping",
    "/api/v1/hooks/l2",
    "/version",
    "/post/",
    "msg-test"
];
