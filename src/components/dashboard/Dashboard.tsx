import {
  Table,
  Card,
  Typography,
  Select,
  DatePicker,
  Space,
  Button,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { getAllTxs } from "../../api/transaction";
import dayjs from "dayjs";
import "./Dashboard.scss";

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface Transaction {
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
}

interface ApiResponse {
  code: number;
  data: {
    totalCount: number;
    txns: ApiTransaction[];
  };
}

interface ApiTransaction {
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
}

const PAGE_SIZE = 10;

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"ascend" | "descend" | null>(null);

  // Filter states
  const [status, setStatus] = useState<string | null>(null);
  const [endlTransactionMode, setEndlTransactionMode] = useState<
    string[] | null
  >(null);
  const [depositType, setDepositType] = useState<string[] | null>(null);
  const [recipientType, setRecipientType] = useState<string[] | null>(null);
  const [sourceCurrency, setSourceCurrency] = useState<string[] | null>(null);
  const [sentOrReceived, setSentOrReceived] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string | null>(null);
  const [dateRangeValue, setDateRangeValue] = useState<
    [dayjs.Dayjs, dayjs.Dayjs] | null
  >(null);

  const fetchTransactions = async (
    page: number,
    size: number,
    sortBy?: string,
    sortDirection?: string
  ) => {
    try {
      setLoading(true);

      // Prepare date parameters if custom date range is selected
      let startDate = null;
      let endDate = null;
      if (dateRange === "CUSTOM" && dateRangeValue) {
        startDate = dateRangeValue[0].format("DD-MM-YYYY");
        endDate = dateRangeValue[1].format("DD-MM-YYYY");
      }

      const response = (await getAllTxs({
        page,
        pageSize: size,
        sortBy: sortBy ? `${sortBy}, ${sortDirection}` : null,
        status: status as any,
        endlTransactionMode: endlTransactionMode as any,
        depositType: depositType as any,
        recipientType: recipientType as any,
        sourceCurrency: sourceCurrency as any,
        sentOrReceived: sentOrReceived as any,
        dateRange: dateRange as any,
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
      }));
      setTransactions(transformedData);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(
      currentPage,
      pageSize,
      sortField || undefined,
      sortOrder === "ascend" ? "asc" : "desc"
    );
  }, [
    currentPage,
    pageSize,
    sortField,
    sortOrder,
    status,
    endlTransactionMode,
    depositType,
    recipientType,
    sourceCurrency,
    sentOrReceived,
    dateRange,
    dateRangeValue,
  ]);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    setSortField(sorter.field);
    setSortOrder(sorter.order);
  };

  const handleFilterChange = (filterType: string, value: any) => {
    switch (filterType) {
      case "status":
        setStatus(value);
        break;
      case "endlTransactionMode":
        setEndlTransactionMode(value);
        break;
      case "depositType":
        setDepositType(value);
        break;
      case "recipientType":
        setRecipientType(value);
        break;
      case "sourceCurrency":
        setSourceCurrency(value);
        break;
      case "sentOrReceived":
        setSentOrReceived(value);
        break;
      case "dateRange":
        setDateRange(value);
        if (value !== "CUSTOM") {
          setDateRangeValue(null);
        }
        break;
      case "dateRangeValue":
        setDateRangeValue(value);
        break;
    }
  };

  const clearFilters = () => {
    setStatus(null);
    setEndlTransactionMode(null);
    setDepositType(null);
    setRecipientType(null);
    setSourceCurrency(null);
    setSentOrReceived(null);
    setDateRange(null);
    setDateRangeValue(null);
    setSortField(null);
    setSortOrder(null);
  };

  const columns: ColumnsType<Transaction> = [
    {
      title: "Date & Time",
      dataIndex: "createdOn",
      key: "createdOn",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
      sorter: true,
    },
    {
      title: "Name",
      dataIndex: "nameOrAlias",
      key: "nameOrAlias",
    },
    {
      title: "Deposit Method",
      dataIndex: "depositRail",
      key: "depositRail",
    },
    {
      title: "Amount Sent",
      dataIndex: "amountRequested",
      key: "amountRequested",
      render: (amount: number, record: Transaction) =>
        `${record.sourceCurrency} ${Number(amount).toFixed(2)}`,
      sorter: true,
    },
    {
      title: "Amount Received",
      dataIndex: "destinationAmount",
      key: "destinationAmount",
      render: (amount: string, record: Transaction) =>
        `${record.destinationCurrency} ${Number(amount).toFixed(2)}`,
      sorter: true,
    },
    {
      title: "Exchange Rate",
      dataIndex: "fxRate",
      key: "fxRate",
      render: (rate: string) => `1:${Number(rate).toFixed(2)}`,
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          style={{
            color:
              status === "COMPLETE"
                ? "#52c41a"
                : status === "REJECTED"
                ? "#ff4d4f"
                : "#faad14",
          }}
        >
          {status}
        </span>
      ),
    },
  ];

  return (
    <div className='dashboard-container'>
      <Card>
        <Title level={2}>Transaction History</Title>

        <Space direction='vertical' style={{ width: "100%", marginBottom: 16 }}>
          <Space wrap>
            <Select
              placeholder='Status'
              allowClear
              style={{ width: 200 }}
              onChange={(value) => handleFilterChange("status", value)}
              value={status}
              options={[
                { label: "INITIATED", value: "INITIATED" },
                { label: "IN_REVIEW", value: "IN_REVIEW" },
                { label: "PENDING", value: "PENDING" },
                { label: "COMPLETE", value: "COMPLETE" },
                { label: "REJECTED", value: "REJECTED" },
              ]}
            />

            <Select
              placeholder='Transaction Mode'
              allowClear
              mode='multiple'
              style={{ width: 200 }}
              onChange={(value) =>
                handleFilterChange("endlTransactionMode", value)
              }
              value={endlTransactionMode}
              options={[
                { label: "STABLE_COIN_TO_FIAT", value: "STABLE_COIN_TO_FIAT" },
                { label: "FIAT_TO_STABLE_COIN", value: "FIAT_TO_STABLE_COIN" },
                { label: "FIAT_TO_FIAT", value: "FIAT_TO_FIAT" },
              ]}
            />

            <Select
              placeholder='Deposit Type'
              allowClear
              mode='multiple'
              style={{ width: 200 }}
              onChange={(value) => handleFilterChange("depositType", value)}
              value={depositType}
              options={[
                { label: "CREDIT_CARD", value: "CREDIT_CARD" },
                { label: "DEBIT_CARD", value: "DEBIT_CARD" },
                { label: "BANK_TRANSFER", value: "BANK_TRANSFER" },
                { label: "CRYPTO_WALLET", value: "CRYPTO_WALLET" },
                {
                  label: "CRYPTO_MANUAL_WALLET",
                  value: "CRYPTO_MANUAL_WALLET",
                },
                { label: "ENDL_ACCOUNT", value: "ENDL_ACCOUNT" },
              ]}
            />

            <Select
              placeholder='Recipient Type'
              allowClear
              mode='multiple'
              style={{ width: 200 }}
              onChange={(value) => handleFilterChange("recipientType", value)}
              value={recipientType}
              options={[
                { label: "INDIVIDUAL", value: "INDIVIDUAL" },
                { label: "BUSINESS", value: "BUSINESS" },
              ]}
            />

            <Select
              placeholder='Source Currency'
              allowClear
              mode='multiple'
              style={{ width: 200 }}
              onChange={(value) => handleFilterChange("sourceCurrency", value)}
              value={sourceCurrency}
              options={[
                { label: "USD", value: "USD" },
                { label: "EUR", value: "EUR" },
                { label: "USDC", value: "USDC" },
              ]}
            />

            <Select
              placeholder='Sent/Received'
              allowClear
              style={{ width: 200 }}
              onChange={(value) => handleFilterChange("sentOrReceived", value)}
              value={sentOrReceived}
              options={[
                { label: "SENT", value: "SENT" },
                { label: "RECEIVED", value: "RECEIVED" },
              ]}
            />

            <Select
              placeholder='Date Range'
              allowClear
              style={{ width: 200 }}
              onChange={(value) => handleFilterChange("dateRange", value)}
              value={dateRange}
              options={[
                { label: "ALL_TIME", value: "ALL_TIME" },
                { label: "YESTERDAY", value: "YESTERDAY" },
                { label: "LAST_7_DAYS", value: "LAST_7_DAYS" },
                { label: "CUSTOM", value: "CUSTOM" },
              ]}
            />

            {dateRange === "CUSTOM" && (
              <RangePicker
                onChange={(dates) =>
                  handleFilterChange("dateRangeValue", dates)
                }
                value={dateRangeValue}
              />
            )}

            <Button onClick={clearFilters}>Clear Filters</Button>
          </Space>
        </Space>

        <Table
          columns={columns}
          dataSource={transactions}
          rowKey='depositId'
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalCount,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} transactions`,
          }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
