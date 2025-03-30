import { useQuery } from '@tanstack/react-query';
import { getAllTxs } from '../api/transaction';
import { Transaction, ApiResponse } from '../utils/types';
import dayjs from 'dayjs';

interface TransactionFilters {
  status: string | null;
  endlTransactionMode: string[] | null;
  depositType: string[] | null;
  recipientType: string[] | null;
  sourceCurrency: string[] | null;
  sentOrReceived: string | null;
  dateRange: string | null;
  dateRangeValue: [dayjs.Dayjs, dayjs.Dayjs] | null;
}

interface TableQueryResult {
  transactions: Transaction[];
  totalCount: number;
}

const transformData = (txns: any[]): Transaction[] => {
  return txns.map((tx) => ({
    createdOn: tx.createdOn,
    nameOrAlias: tx.nameOrAlias,
    depositRail: tx.depositRail,
    amountRequested: tx.sourceAmount,
    sourceCurrency: tx.sourceCurrency,
    destinationAmount: tx.destinationAmount,
    destinationCurrency: tx.destinationCurrency,
    fxRate: tx.fxRate,
    status: tx.status,
    depositId: tx.depositId,
    sentOrReceived: tx.sentOrReceived,
    endlTransactionMode: tx.endITransactionMode,
  }));
};

const getQueryParams = (filters: TransactionFilters, page?: number, pageSize?: number, sortField?: string | null, sortOrder?: 'ascend' | 'descend' | null) => {
  let startDate = null;
  let endDate = null;
  if (filters.dateRange === 'CUSTOM' && filters.dateRangeValue) {
    startDate = filters.dateRangeValue[0].format('DD-MM-YYYY');
    endDate = filters.dateRangeValue[1].format('DD-MM-YYYY');
  }

  const sortFieldName = sortField ? {
    'createdOn': 'createdOn',
    'nameOrAlias': 'alias',
    'amountRequested': 'sourceAmount',
    'destinationAmount': 'destinationAmount',
    'sentOrReceived': 'sentOrReceived',
  }[sortField] : null;

  const sortByParam = sortFieldName ? `${sortFieldName},${sortOrder === 'ascend' ? 'asc' : 'desc'}` : null;

  return {
    page,
    pageSize,
    sortBy: sortByParam,
    status: filters.status as any,
    endlTransactionMode: filters.endlTransactionMode as any,
    depositType: filters.depositType as any,
    recipientType: filters.recipientType as any,
    sourceCurrency: filters.sourceCurrency as any,
    sentOrReceived: filters.sentOrReceived as any,
    dateRange: filters.dateRange as any,
    startDate,
    endDate,
  };
};

export const useTransactions = (
  page: number,
  pageSize: number,
  sortField: string | null,
  sortOrder: 'ascend' | 'descend' | null,
  filters: TransactionFilters
) => {
  const queryParams = getQueryParams(filters, page, pageSize, sortField, sortOrder);
  const chartQueryParams = getQueryParams(filters);

  const tableQuery = useQuery<TableQueryResult>({
    queryKey: ['transactions', 'table', chartQueryParams],
    queryFn: async () => {
      const response = await getAllTxs(chartQueryParams) as ApiResponse;
      return {
        transactions: transformData(response.data.txns),
        totalCount: response.data.totalCount
      };
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  // const chartQuery = useQuery<Transaction[]>({
  //   queryKey: ['transactions', 'chart', chartQueryParams],
  //   queryFn: async () => {
  //     const response = await getAllTxs(chartQueryParams) as ApiResponse;
  //     return transformData(response.data.txns);
  //   },
  //   staleTime: 30000, // Consider data fresh for 30 seconds
  //   gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  // });

  return {
    transactions: tableQuery.data?.transactions ?? [],
    chartTransactions: tableQuery.data?.transactions ?? [],
    loading: tableQuery.isLoading ,
    totalCount: tableQuery.data?.totalCount ?? 0,
    refreshTransactions: () => {
      tableQuery.refetch();
    },
  };
}; 