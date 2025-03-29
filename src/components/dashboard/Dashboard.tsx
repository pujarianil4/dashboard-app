import { Table, Card, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { getAllTxs } from "../../api/transaction";
import dayjs from "dayjs";
import "./Dashboard.scss";

const { Title } = Typography;

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

  const fetchTransactions = async (page: number, size: number) => {
    try {
      setLoading(true);
      const response = (await getAllTxs({
        page,
        pageSize: size,
      })) as ApiResponse;
      console.log("response", response);

      // Transform the data to match our Transaction interface
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
    fetchTransactions(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const columns: ColumnsType<Transaction> = [
    {
      title: "Date & Time",
      dataIndex: "createdOn",
      key: "createdOn",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
      sorter: (a, b) =>
        new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime(),
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
    },
    {
      title: "Amount Received",
      dataIndex: "destinationAmount",
      key: "destinationAmount",
      render: (amount: string, record: Transaction) =>
        `${record.destinationCurrency} ${Number(amount).toFixed(2)}`,
    },
    {
      title: "Exchange Rate",
      dataIndex: "fxRate",
      key: "fxRate",
      render: (rate: string) => `1:${Number(rate).toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          style={{
            color:
              status === "COMPLETED"
                ? "#52c41a"
                : status === "FAILED"
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
