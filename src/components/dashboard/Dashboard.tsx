import {
  Table,
  Card,
  Typography,
  Select,
  DatePicker,
  Space,
  Button,
  Row,
  Col,
  Tag,
  Tooltip,
  Input,
  Divider,
  Badge,
  Statistic,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState, useRef } from "react";
import { getAllTxs } from "../../api/transaction";
import dayjs from "dayjs";
import {
  ReloadOutlined,
  FilterOutlined,
  SearchOutlined,
  ClearOutlined,
  TransactionOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import "./Dashboard.scss";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Search } = Input;

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

  const tableRef = useRef<any>(null);

  const getSortField = (field: string | null): string | null => {
    switch (field) {
      case "createdOn":
        return "createdOn";
      case "nameOrAlias":
        return "alias";
      case "amountRequested":
        return "sourceAmount";
      case "destinationAmount":
        return "destinationAmount";
      case "status":
        return "sentOrReceived";
      default:
        return null;
    }
  };

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

      // Get the correct sort field name
      const sortFieldName = getSortField(sortBy || null);
      const sortByParam = sortFieldName
        ? `${sortFieldName},${sortDirection}`
        : null;

      const response = (await getAllTxs({
        page,
        pageSize: size,
        sortBy: sortByParam,
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

    if (tableRef.current) {
      tableRef.current.clearSort();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETE":
        return "success";
      case "REJECTED":
        return "error";
      case "INITIATED":
        return "processing";
      case "IN_REVIEW":
        return "warning";
      case "PENDING":
        return "default";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<Transaction> = [
    {
      title: "Date & Time",
      dataIndex: "createdOn",
      key: "createdOn",
      render: (text: string) => (
        <Tooltip title={dayjs(text).format("YYYY-MM-DD HH:mm:ss")}>
          <Text>{dayjs(text).format("MMM DD, YYYY HH:mm")}</Text>
        </Tooltip>
      ),
      sorter: true,
      width: 180,
    },
    {
      title: "Name",
      dataIndex: "nameOrAlias",
      key: "nameOrAlias",
      width: 150,
      sorter: true,
    },
    {
      title: "Deposit Method",
      dataIndex: "depositRail",
      key: "depositRail",
      width: 150,
    },
    {
      title: "Amount Sent",
      dataIndex: "amountRequested",
      key: "amountRequested",
      render: (amount: number, record: Transaction) => (
        <Text strong>
          {record.sourceCurrency} {Number(amount).toFixed(2)}
        </Text>
      ),
      sorter: true,
      width: 150,
    },
    {
      title: "Amount Received",
      dataIndex: "destinationAmount",
      key: "destinationAmount",
      render: (amount: string, record: Transaction) => (
        <Text strong>
          {record.destinationCurrency} {Number(amount).toFixed(2)}
        </Text>
      ),
      sorter: true,
      width: 150,
    },
    {
      title: "Exchange Rate",
      dataIndex: "fxRate",
      key: "fxRate",
      render: (rate: string) => (
        <Text type='secondary'>1:{Number(rate).toFixed(2)}</Text>
      ),
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
      width: 120,
    },
  ];

  const getActiveFiltersCount = () => {
    let count = 0;
    if (status) count++;
    if (endlTransactionMode?.length) count++;
    if (depositType?.length) count++;
    if (recipientType?.length) count++;
    if (sourceCurrency?.length) count++;
    if (sentOrReceived) count++;
    if (dateRange) count++;
    if (dateRangeValue) count++;
    if (sortField) count++;
    return count;
  };

  return (
    <div className='dashboard-container'>
      <Card
        className='dashboard-card'
        title={
          <Row justify='space-between' align='middle'>
            <Col>
              <Space>
                <TransactionOutlined
                  style={{ fontSize: 24, color: "#1890ff" }}
                />
                <Title level={3} style={{ margin: 0 }}>
                  Transaction History
                </Title>
              </Space>
            </Col>
            <Col>
              <Space style={{ marginRight: 10 }}>
                <Tooltip title='Clear all filters'>
                  <Badge
                    count={getActiveFiltersCount()}
                    offset={[-5, 5]}
                    style={{ marginRight: 8 }}
                  >
                    <Button
                      icon={<ClearOutlined />}
                      onClick={clearFilters}
                      disabled={getActiveFiltersCount() === 0}
                    />
                  </Badge>
                </Tooltip>
                <Tooltip title='Refresh data'>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() =>
                      fetchTransactions(
                        currentPage,
                        pageSize,
                        sortField || undefined,
                        sortOrder === "ascend" ? "asc" : "desc"
                      )
                    }
                  />
                </Tooltip>
              </Space>
            </Col>
          </Row>
        }
      >
        <Space direction='vertical' style={{ width: "100%" }} size='large'>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Card size='small' className='stat-card'>
                <Statistic
                  title='Total Transactions'
                  value={totalCount}
                  prefix={<TransactionOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card size='small' className='stat-card'>
                <Statistic
                  title='Active Filters'
                  value={getActiveFiltersCount()}
                  prefix={<FilterOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card size='small' className='stat-card'>
                <Statistic
                  title='Current Page'
                  value={currentPage}
                  suffix={`/ ${Math.ceil(totalCount / pageSize)}`}
                />
              </Card>
            </Col>
          </Row>

          <Card
            size='small'
            className='filters-card'
            title={
              <Space>
                <FilterOutlined style={{ color: "#1890ff" }} />
                <Text strong>Filters</Text>
                {getActiveFiltersCount() > 0 && (
                  <Tag color='blue'>{getActiveFiltersCount()} active</Tag>
                )}
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder='Status'
                  allowClear
                  style={{ width: "100%" }}
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
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder='Transaction Mode'
                  allowClear
                  mode='multiple'
                  style={{ width: "100%" }}
                  onChange={(value) =>
                    handleFilterChange("endlTransactionMode", value)
                  }
                  value={endlTransactionMode}
                  options={[
                    {
                      label: "STABLE_COIN_TO_FIAT",
                      value: "STABLE_COIN_TO_FIAT",
                    },
                    {
                      label: "FIAT_TO_STABLE_COIN",
                      value: "FIAT_TO_STABLE_COIN",
                    },
                    { label: "FIAT_TO_FIAT", value: "FIAT_TO_FIAT" },
                  ]}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder='Deposit Type'
                  allowClear
                  mode='multiple'
                  style={{ width: "100%" }}
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
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder='Recipient Type'
                  allowClear
                  mode='multiple'
                  style={{ width: "100%" }}
                  onChange={(value) =>
                    handleFilterChange("recipientType", value)
                  }
                  value={recipientType}
                  options={[
                    { label: "INDIVIDUAL", value: "INDIVIDUAL" },
                    { label: "BUSINESS", value: "BUSINESS" },
                  ]}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder='Source Currency'
                  allowClear
                  mode='multiple'
                  style={{ width: "100%" }}
                  onChange={(value) =>
                    handleFilterChange("sourceCurrency", value)
                  }
                  value={sourceCurrency}
                  options={[
                    { label: "USD", value: "USD" },
                    { label: "EUR", value: "EUR" },
                    { label: "USDC", value: "USDC" },
                  ]}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder='Sent/Received'
                  allowClear
                  style={{ width: "100%" }}
                  onChange={(value) =>
                    handleFilterChange("sentOrReceived", value)
                  }
                  value={sentOrReceived}
                  options={[
                    { label: "SENT", value: "SENT" },
                    { label: "RECEIVED", value: "RECEIVED" },
                  ]}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder='Date Range'
                  allowClear
                  style={{ width: "100%" }}
                  onChange={(value) => handleFilterChange("dateRange", value)}
                  value={dateRange}
                  options={[
                    { label: "ALL_TIME", value: "ALL_TIME" },
                    { label: "YESTERDAY", value: "YESTERDAY" },
                    { label: "LAST_7_DAYS", value: "LAST_7_DAYS" },
                    { label: "CUSTOM", value: "CUSTOM" },
                  ]}
                />
              </Col>
              {dateRange === "CUSTOM" && (
                <Col xs={24} sm={12} md={8}>
                  <RangePicker
                    style={{ width: "100%" }}
                    onChange={(dates) =>
                      handleFilterChange("dateRangeValue", dates)
                    }
                    value={dateRangeValue}
                  />
                </Col>
              )}
            </Row>
          </Card>

          <Table
            ref={tableRef}
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
              showTotal: (total) => (
                <Space>
                  <Text type='secondary'>Total</Text>
                  <Text strong>{total}</Text>
                  <Text type='secondary'>transactions</Text>
                </Space>
              ),
              showQuickJumper: true,
              showLessItems: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              size: "default",
              position: ["bottomRight"],
              className: "custom-pagination",
            }}
            scroll={{ x: 1200 }}
            className='transactions-table'
          />
        </Space>
      </Card>
    </div>
  );
};

export default Dashboard;
