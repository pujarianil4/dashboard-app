import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Space,
  Typography,
  Tag,
} from "antd";
import { FilterOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface TransactionFiltersProps {
  status: string | null;
  endlTransactionMode: string[] | null;
  depositType: string[] | null;
  recipientType: string[] | null;
  sourceCurrency: string[] | null;
  sentOrReceived: string | null;
  dateRange: string | null;
  dateRangeValue: [dayjs.Dayjs, dayjs.Dayjs] | null;
  activeFiltersCount: number;
  onFilterChange: (filterType: string, value: any) => void;
}

export const TransactionFilters = ({
  status,
  endlTransactionMode,
  depositType,
  recipientType,
  sourceCurrency,
  sentOrReceived,
  dateRange,
  dateRangeValue,
  activeFiltersCount,
  onFilterChange,
}: TransactionFiltersProps) => {
  return (
    <Card
      size='small'
      className='filters-card'
      title={
        <Space>
          <FilterOutlined style={{ color: "#1890ff" }} />
          <Text strong>Filters</Text>
          {activeFiltersCount > 0 && (
            <Tag color='blue'>{activeFiltersCount} active</Tag>
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
            onChange={(value) => onFilterChange("status", value)}
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
            onChange={(value) => onFilterChange("endlTransactionMode", value)}
            value={endlTransactionMode}
            options={[
              { label: "STABLE_COIN_TO_FIAT", value: "STABLE_COIN_TO_FIAT" },
              { label: "FIAT_TO_STABLE_COIN", value: "FIAT_TO_STABLE_COIN" },
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
            onChange={(value) => onFilterChange("depositType", value)}
            value={depositType}
            options={[
              { label: "CREDIT_CARD", value: "CREDIT_CARD" },
              { label: "DEBIT_CARD", value: "DEBIT_CARD" },
              { label: "BANK_TRANSFER", value: "BANK_TRANSFER" },
              { label: "CRYPTO_WALLET", value: "CRYPTO_WALLET" },
              { label: "CRYPTO_MANUAL_WALLET", value: "CRYPTO_MANUAL_WALLET" },
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
            onChange={(value) => onFilterChange("recipientType", value)}
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
            onChange={(value) => onFilterChange("sourceCurrency", value)}
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
            onChange={(value) => onFilterChange("sentOrReceived", value)}
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
            onChange={(value) => onFilterChange("dateRange", value)}
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
              onChange={(dates) => onFilterChange("dateRangeValue", dates)}
              value={dateRangeValue}
            />
          </Col>
        )}
      </Row>
    </Card>
  );
};
