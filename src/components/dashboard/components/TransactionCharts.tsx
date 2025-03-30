import { Card, Row, Col, Statistic, Spin } from "antd";
import { Pie, Line } from "@ant-design/charts";
import { Transaction } from "../../../utils/types";
import dayjs from "dayjs";
import { useEffect } from "react";

interface TransactionChartsProps {
  transactions: Transaction[];
  loading: boolean;
}

export const TransactionCharts = ({
  transactions,
  loading,
}: TransactionChartsProps) => {
  // Calculate statistics with proper checks
  const totalVolume = transactions.length;
  const successRate =
    totalVolume > 0
      ? (transactions.filter((tx) => tx.status === "COMPLETE").length /
          totalVolume) *
        100
      : 0;
  const avgAmount =
    totalVolume > 0
      ? transactions.reduce((sum, tx) => sum + Number(tx.amountRequested), 0) /
        totalVolume
      : 0;
  const activeCurrencies = new Set(transactions.map((tx) => tx.sourceCurrency))
    .size;

  const currencyData = transactions.reduce((acc: any[], tx) => {
    const existing = acc.find((item) => item.currency === tx.sourceCurrency);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ currency: tx.sourceCurrency, value: 1 });
    }
    return acc;
  }, []);

  const statusTimelineData = transactions
    .reduce((acc: any[], tx) => {
      const date = dayjs(tx.createdOn).format("YYYY-MM-DD");
      const existing = acc.find(
        (item) => item.date === date && item.status === tx.status
      );
      if (existing) {
        existing.value++;
      } else {
        acc.push({ date, status: tx.status, value: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => a.date.localeCompare(b.date));

  const pieConfig = {
    data: currencyData,
    angleField: "value",
    colorField: "currency",
    label: {
      text: "value",
      style: {
        fontWeight: "bold",
      },
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
    interactions: [{ type: "element-active" }],
    responsive: true,
  };

  const lineConfig = {
    data: statusTimelineData,
    xField: "date",
    yField: "value",
    seriesField: "status",
    smooth: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 1000,
      },
    },
    interactions: [{ type: "element-active" }],
    responsive: true,
  };

  useEffect(() => {
    console.log("transactions", currencyData, statusTimelineData);
  }, [transactions]);

  return (
    <div className='transaction-charts'>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Spin spinning={loading}>
              <Statistic
                title='Total Transactions'
                value={loading ? 0 : totalVolume}
              />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Spin spinning={loading}>
              <Statistic
                title='Success Rate'
                value={loading ? 0 : successRate}
                suffix='%'
                precision={2}
              />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Spin spinning={loading}>
              <Statistic
                title='Avg Transaction Amount'
                value={loading ? 0 : avgAmount}
                precision={2}
              />
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Spin spinning={loading}>
              <Statistic
                title='Active Currencies'
                value={loading ? 0 : activeCurrencies}
              />
            </Spin>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col xs={24} lg={12}>
          <Card title='Currency Distribution'>
            <Spin spinning={loading}>
              <div style={{ height: "300px", width: "100%" }}>
                <Pie {...pieConfig} />
              </div>
            </Spin>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title='Transaction Status Timeline'>
            <Spin spinning={loading}>
              <div style={{ height: "300px", width: "100%" }}>
                <Line {...lineConfig} />
              </div>
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
