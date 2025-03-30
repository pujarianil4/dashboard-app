import { useState, useEffect } from 'react';
import { getAllTxs } from '../api/transaction';
import { Transaction, ApiResponse } from '../utils/types';
import dayjs from 'dayjs';

export const useTransactions = (
  page: number,
  pageSize: number,
  sortField: string | null,
  sortOrder: 'ascend' | 'descend' | null,
  filters: {
    status: string | null;
    endlTransactionMode: string[] | null;
    depositType: string[] | null;
    recipientType: string[] | null;
    sourceCurrency: string[] | null;
    sentOrReceived: string | null;
    dateRange: string | null;
    dateRangeValue: [dayjs.Dayjs, dayjs.Dayjs] | null;
  }
) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const getSortField = (field: string | null): string | null => {
    switch (field) {
      case 'createdOn':
        return 'createdOn';
      case 'nameOrAlias':
        return 'alias';
      case 'amountRequested':
        return 'sourceAmount';
      case 'destinationAmount':
        return 'destinationAmount';
      case 'sentOrReceived':
        return 'sentOrReceived';
      default:
        return null;
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      // Prepare date parameters if custom date range is selected
      let startDate = null;
      let endDate = null;
      if (filters.dateRange === 'CUSTOM' && filters.dateRangeValue) {
        startDate = filters.dateRangeValue[0].format('DD-MM-YYYY');
        endDate = filters.dateRangeValue[1].format('DD-MM-YYYY');
      }

      // Get the correct sort field name
      const sortFieldName = getSortField(sortField);
      const sortByParam = sortFieldName ? `${sortFieldName},${sortOrder === 'ascend' ? 'asc' : 'desc'}` : null;

      const response = (await getAllTxs({
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
      })) as ApiResponse;

      const transformedData = response.data.txns.map((tx) => ({
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
      }));
      setTransactions(transformedData);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, pageSize, sortField, sortOrder, ...Object.values(filters)]);

  return {
    transactions,
    loading,
    totalCount,
    refreshTransactions: fetchTransactions,
  };
}; 