import { useState } from "react";
import {
  Card,
  Space,
  Button,
  Row,
  Col,
  Typography,
  Badge,
  Tooltip,
  notification,
} from "antd";
import { useTransactions } from "../../hooks/useTransactions";
import { StatisticsCards } from "./components/StatisticsCards";
import { TransactionFilters } from "./components/TransactionFilters";
import { TransactionTable } from "./components/TransactionTable";
import dayjs from "dayjs";
import {
  ClearOutlined,
  ReloadOutlined,
  TransactionOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { logout as logoutApi } from "../../api/auth";
import "./Dashboard.scss";

const { Title } = Typography;

export const Dashboard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"ascend" | "descend" | null>(null);
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { transactions, loading, totalCount, refreshTransactions } =
    useTransactions(currentPage, pageSize, sortField, sortOrder, {
      status,
      endlTransactionMode,
      depositType,
      recipientType,
      sourceCurrency,
      sentOrReceived,
      dateRange,
      dateRangeValue,
    });

  const handleTableChange = (pagination: any, _: any, sorter: any) => {
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

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutApi();
      notification.success({
        message: "Success",
        description: "Logged out successfully",
        placement: "top",
      });
      localStorage.removeItem("auth");
      navigate("/login");
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to logout. Please try again.",
        placement: "top",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const activeFiltersCount = [
    status ? [status] : [],
    endlTransactionMode || [],
    depositType || [],
    recipientType || [],
    sourceCurrency || [],
    sentOrReceived ? [sentOrReceived] : [],
    dateRange ? [dateRange] : [],
    dateRangeValue ? ["customDateRange"] : [],
  ].filter((filter) => filter.length > 0).length;

  return (
    <div className='dashboard'>
      <Space direction='vertical' size='large' style={{ width: "100%" }}>
        <Card className='dashboard-card'>
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
                    count={activeFiltersCount}
                    offset={[-5, 5]}
                    style={{ marginRight: 8 }}
                  >
                    <Button
                      icon={<ClearOutlined />}
                      onClick={clearFilters}
                      disabled={activeFiltersCount === 0}
                    />
                  </Badge>
                </Tooltip>
                <Tooltip title='Refresh data'>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={refreshTransactions}
                  />
                </Tooltip>
                <Tooltip title='Logout'>
                  <Button
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    danger
                    loading={isLoggingOut}
                  />
                </Tooltip>
              </Space>
            </Col>
          </Row>
        </Card>

        <StatisticsCards
          totalCount={totalCount}
          activeFiltersCount={activeFiltersCount}
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / pageSize)}
        />

        <TransactionFilters
          status={status}
          endlTransactionMode={endlTransactionMode}
          depositType={depositType}
          recipientType={recipientType}
          sourceCurrency={sourceCurrency}
          sentOrReceived={sentOrReceived}
          dateRange={dateRange}
          dateRangeValue={dateRangeValue}
          activeFiltersCount={activeFiltersCount}
          onFilterChange={handleFilterChange}
        />

        <Card className='dashboard-card'>
          <TransactionTable
            transactions={transactions}
            loading={loading}
            currentPage={currentPage}
            pageSize={pageSize}
            totalCount={totalCount}
            sortField={sortField}
            sortOrder={sortOrder}
            onTableChange={handleTableChange}
          />
        </Card>
      </Space>
    </div>
  );
};
