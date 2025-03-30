import { useQuery } from '@tanstack/react-query';
import { getAllTxs } from '../api/transaction';
import { Transaction, ApiResponse } from '../utils/types';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

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

const getQueryParams = (filters: TransactionFilters,  sortField?: string | null, sortOrder?: 'ascend' | 'descend' | null, page?: number, pageSize?: number,) => {
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
  const queryParams = getQueryParams(filters,  sortField, sortOrder);
  const chartQueryParams = getQueryParams(filters, );
  console.log(page, pageSize, queryParams);
  const [tableTxs, setTableTxs] = useState<TableQueryResult>({
    transactions: [],
    totalCount: 0,
  })
  const [chartTxs, setChartTxs] = useState<Transaction[]>([])

  
  const shouldSkipQuery = filters.dateRange === 'CUSTOM' && !filters.dateRangeValue;
  const tableQuery = useQuery<TableQueryResult>({
    queryKey: ['transactions', 'table', queryParams],
    queryFn: async () => {
      const response = await getAllTxs(queryParams) as ApiResponse;
      const transformedRes = {
        transactions: transformData(response.data.txns),
        totalCount: response.data.totalCount
      }
      setTableTxs(transformedRes)
      return transformedRes;
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes,
    enabled: !shouldSkipQuery,
  });

  const chartQuery = useQuery<Transaction[]>({
    queryKey: ['transactions', 'chart', chartQueryParams],
    queryFn: async () => {
      const response = await getAllTxs(chartQueryParams) as ApiResponse;
      setChartTxs(transformData(response.data.txns));
      return transformData(response.data.txns);
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    enabled: !shouldSkipQuery,
  });

 

  return {
    transactions: tableTxs?.transactions ?? [],
    chartTransactions: chartTxs ?? [],
    tableLoading: tableQuery.isLoading,
    chartLoading: chartQuery.isLoading,
    totalCount: tableTxs.totalCount,
    refreshTransactions: () => {
      tableQuery.refetch();
      chartQuery.refetch();
    },
  };
}; 