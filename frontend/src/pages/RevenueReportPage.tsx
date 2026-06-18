import { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  DatePicker,
  Spin,
  Empty,
  Typography,
  Space,
} from 'antd';
import {
  DollarOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  CalculatorOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { reportsApi } from '../api/reports.api';
import type {
  RevenueSummary,
  DailyRevenue,
  TopItem,
  PaymentMethod,
} from '../types/sprint7.types';

const { Title } = Typography;
const { RangePicker } = DatePicker;

// Format tiền Việt Nam
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
};

// Payment method label
const paymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    TIEN_MAT: 'Tiền mặt',
    CHUYEN_KHOAN: 'Chuyển khoản',
    THE: 'Thẻ',
  };
  return labels[method] || method;
};

export function RevenueReportPage() {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);

  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [dailyData, setDailyData] = useState<DailyRevenue[]>([]);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const fromDate = dateRange[0]?.format('YYYY-MM-DD');
        const toDate = dateRange[1]?.format('YYYY-MM-DD');

        const [summaryRes, dailyRes, topRes, paymentRes] = await Promise.all([
          reportsApi.getRevenueSummary(fromDate, toDate),
          reportsApi.getRevenueByDay(fromDate, toDate),
          reportsApi.getTopItems(fromDate, toDate, 10),
          reportsApi.getRevenueByPaymentMethod(fromDate, toDate),
        ]);

        if (!cancelled) {
          setSummary(summaryRes);
          setDailyData(dailyRes.daily || []);
          setTopItems(topRes.items || []);
          setPaymentMethods(paymentRes.methods || []);
        }
      } catch (error) {
        console.error('Failed to fetch report data:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [dateRange]);

  // Columns for daily revenue table
  const dailyColumns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Số hóa đơn',
      dataIndex: 'invoices',
      key: 'invoices',
      align: 'right' as const,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      align: 'right' as const,
      render: (revenue: number) => formatCurrency(revenue),
    },
  ];

  // Columns for top items table
  const topItemColumns = [
    {
      title: 'Tên món',
      dataIndex: 'item_name',
      key: 'item_name',
    },
    {
      title: 'Số lượng bán',
      dataIndex: 'quantity_sold',
      key: 'quantity_sold',
      align: 'right' as const,
    },
    {
      title: 'Doanh thu ước tính',
      dataIndex: 'revenue',
      key: 'revenue',
      align: 'right' as const,
      render: (revenue: number) => formatCurrency(revenue),
    },
  ];

  // Columns for payment methods table
  const paymentColumns = [
    {
      title: 'Phương thức',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (method: string) => paymentMethodLabel(method),
    },
    {
      title: 'Số giao dịch',
      dataIndex: 'transaction_count',
      key: 'transaction_count',
      align: 'right' as const,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_amount',
      key: 'total_amount',
      align: 'right' as const,
      render: (amount: number) => formatCurrency(amount),
    },
  ];

  return (
    <div>
      <Title level={4}>Báo cáo doanh thu</Title>

      {/* Bộ lọc thời gian */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <span>Thời gian:</span>
          <RangePicker
            value={dateRange as [Dayjs, Dayjs]}
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setDateRange([dates[0], dates[1]]);
              }
            }}
            format="DD/MM/YYYY"
          />
        </Space>
      </Card>

      <Spin spinning={loading}>
        {/* Cards tổng quan */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng doanh thu"
                value={summary?.total_revenue || 0}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Hóa đơn đã thanh toán"
                value={summary?.total_invoices || 0}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng đơn hàng"
                value={summary?.total_orders || 0}
                prefix={<ShoppingCartOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Giá trị trung bình HĐ"
                value={summary?.average_invoice || 0}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<CalculatorOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Bảng doanh thu theo ngày */}
        <Card title="Doanh thu theo ngày" style={{ marginBottom: 16 }}>
          {dailyData.length > 0 ? (
            <Table
              dataSource={dailyData}
              columns={dailyColumns}
              rowKey="date"
              pagination={false}
              size="small"
            />
          ) : (
            <Empty description="Không có dữ liệu" />
          )}
        </Card>

        {/* Bảng top món bán chạy */}
        <Card title="Top món bán chạy" style={{ marginBottom: 16 }}>
          {topItems.length > 0 ? (
            <Table
              dataSource={topItems}
              columns={topItemColumns}
              rowKey="item_id"
              pagination={false}
              size="small"
            />
          ) : (
            <Empty description="Không có dữ liệu" />
          )}
        </Card>

        {/* Bảng phương thức thanh toán */}
        <Card title="Doanh thu theo phương thức thanh toán">
          {paymentMethods.length > 0 ? (
            <Table
              dataSource={paymentMethods}
              columns={paymentColumns}
              rowKey="payment_method"
              pagination={false}
              size="small"
            />
          ) : (
            <Empty description="Không có dữ liệu thanh toán" />
          )}
        </Card>
      </Spin>
    </div>
  );
}
