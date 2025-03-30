import { Card, Row, Col, Statistic } from "antd";
import { TransactionOutlined, FilterOutlined } from "@ant-design/icons";

interface StatisticsCardsProps {
  totalCount: number;
  activeFiltersCount: number;
  currentPage: number;
  totalPages: number;
}

export const StatisticsCards = ({
  totalCount,
  activeFiltersCount,
  currentPage,
  totalPages,
}: StatisticsCardsProps) => {
  return (
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
            value={activeFiltersCount}
            prefix={<FilterOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card size='small' className='stat-card'>
          <Statistic
            title='Current Page'
            value={currentPage}
            suffix={`/ ${totalPages}`}
          />
        </Card>
      </Col>
    </Row>
  );
};
