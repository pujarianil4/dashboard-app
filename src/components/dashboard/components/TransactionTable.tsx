import { Table, Tag, Typography, Tooltip, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Transaction } from "../../../utils/types";

const { Text } = Typography;

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  sortField: string | null;
  sortOrder: "ascend" | "descend" | null;
  onTableChange: (pagination: any, filters: any, sorter: any) => void;
}

export const TransactionTable = ({
  transactions,
  loading,
  currentPage,
  pageSize,
  totalCount,
  sortField,
  sortOrder,
  onTableChange,
}: TransactionTableProps) => {
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

  const getSentOrReceivedColor = (value: string) => {
    switch (value) {
      case "SENT":
        return "blue";
      case "RECEIVED":
        return "green";
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
      title: "Sent/Received",
      dataIndex: "sentOrReceived",
      key: "sentOrReceived",
      render: (value: string) => (
        <Tag color={getSentOrReceivedColor(value.toUpperCase())}>{value}</Tag>
      ),
      width: 120,
      sorter: true,
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

  return (
    <Table
      columns={columns}
      dataSource={transactions}
      rowKey='depositId'
      loading={loading}
      onChange={onTableChange}
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
  );
};
