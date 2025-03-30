// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Transaction Types
export interface Transaction {
  createdOn: string;
  nameOrAlias: string;
  depositRail: string;
  amountRequested: number;
  sourceCurrency: string;
  destinationAmount: string;
  destinationCurrency: string;
  fxRate: string;
  status: string;
  depositId: string;
  sentOrReceived: string;
}

export interface ApiResponse {
  code: number;
  data: {
    totalCount: number;
    txns: ApiTransaction[];
  };
}

export interface ApiTransaction {
  txnId: string;
  nameOrAlias: string;
  userId: string;
  quoteId: string;
  depositId: string;
  createdOn: string;
  depositRail: string;
  sourceAmount: number;
  sourceCurrency: string;
  destinationAmount: string;
  destinationCurrency: string;
  fxRate: string;
  status: string;
  sentOrReceived: string;
}

export type TransactionStatus = 'INITIATED' | 'IN_REVIEW' | 'PENDING' | 'COMPLETE' | 'REJECTED';
export type EndlTransactionMode = 'STABLE_COIN_TO_FIAT' | 'FIAT_TO_STABLE_COIN' | 'FIAT_TO_FIAT';
export type DepositType = 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'CRYPTO_WALLET' | 'CRYPTO_MANUAL_WALLET' | 'ENDL_ACCOUNT';
export type RecipientType = 'INDIVIDUAL' | 'BUSINESS';
export type SentOrReceived = 'SENT' | 'RECEIVED';
export type DateRange = 'ALL_TIME' | 'YESTERDAY' | 'LAST_7_DAYS' | 'CUSTOM';

// Route Types
export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface PublicRouteProps {
  children: React.ReactNode;
} 