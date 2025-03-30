import apiClient from '../configs/axiosInstance'

type TransactionStatus = 'INITIATED' | 'IN_REVIEW' | 'PENDING' | 'COMPLETE' | 'REJECTED';
type EndlTransactionMode = 'STABLE_COIN_TO_FIAT' | 'FIAT_TO_STABLE_COIN' | 'FIAT_TO_FIAT';
type DepositType = 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'CRYPTO_WALLET' | 'CRYPTO_MANUAL_WALLET' | 'ENDL_ACCOUNT';
type RecipientType = 'INDIVIDUAL' | 'BUSINESS';
type SentOrReceived = 'SENT' | 'RECEIVED';
type DateRange = 'ALL_TIME' | 'YESTERDAY' | 'LAST_7_DAYS' | 'CUSTOM';

interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string | null;
  status?: TransactionStatus | null;
  endlTransactionMode?: EndlTransactionMode[] | null;
  depositType?: DepositType[] | null;
  recipientType?: RecipientType[] | null;
  sourceCurrency?: string[] | null;
  sentOrReceived?: SentOrReceived | null;
  dateRange?: DateRange | null;
  startDate?: string | null;
  endDate?: string | null;
}

export const getAllTxs = async (params?: PaginationParams): Promise<unknown> => {
  const requestBody: any = {
    page: params?.page || 0,
    size: params?.pageSize || 10,
    sortBy: params?.sortBy || 'id,desc',
  };

  // Only add filters if they are not null
  if (params?.status) requestBody.status = params.status;
  if (params?.endlTransactionMode) requestBody.endITransactionMode = params.endlTransactionMode;
  if (params?.depositType) requestBody.depositType = params.depositType;
  if (params?.recipientType) requestBody.recipientType = params.recipientType;
  if (params?.sourceCurrency) requestBody.sourceCurrency = params.sourceCurrency;
  if (params?.sentOrReceived) requestBody.sentOrReceived = params.sentOrReceived;
  if (params?.dateRange) requestBody.dateRange = params.dateRange;
  if (params?.dateRange === 'CUSTOM') {
    if (params?.startDate) requestBody.startDate = params.startDate;
    if (params?.endDate) requestBody.endDate = params.endDate;
  }

  console.log("requestBody", requestBody);
  

  return (await apiClient.post("/txn/all", requestBody, {
    headers: {
      "Content-Type": "application/json",
    },
  })).data;
};