import apiClient from '../configs/axiosInstance'


export const getAllTxs = async (): Promise<unknown> =>
  (await apiClient.post("/txn/all", {
    page: 0,
size: 10,
sortBy: "recipientName, asc",
status: "INITIATED",
endITransactionMode: ["STABLE_COIN_TO_FIAT", "FIAT_TO_FIAT"],
 depositType: ["CRYPTO_WALLET"],
 recipientType: ["INDIVIDUAL"],
 sourceCurrency: ["USDC"],
 dateRange: "CUSTOM",
 startDate: "14-01-2024",
endDate: "25-01-2025"
  },  {
    headers: {
      "Content-Type": "application/json",
    },
  })).data;