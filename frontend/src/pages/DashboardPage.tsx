import { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Tag,
  Table,
  List,
  Button,
  Spin,
  Divider,
  Badge,
} from 'antd';
import {
  TableOutlined,
  ShoppingCartOutlined,
  CoffeeOutlined,
  DollarOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  RiseOutlined,
  AppstoreOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { tablesApi } from '../api/tables.api';
import { ordersApi } from '../api/orders.api';
import { kitchenApi } from '../api/kitchen.api';
import { getLowStock } from '../api/inventory.api';
import { reportsApi } from '../api/reports.api';
import { formatCurrency } from '../api/unwrap';
import type { Table as TableType } from '../types/sprint2.types';
import type { Order } from '../types/sprint3.types';
import type { KitchenItem } from '../types/sprint5.types';
import type { RevenueSummary, DailyRevenue } from '../types/sprint7.types';
import type { Ingredient } from '../types/inventory.types';

const { Title, Text } = Typography;

interface DashboardStats {
  totalTables: number;
  emptyTables: number;
  busyTables: number;
  openOrders: number;
  kitchenPending: number;
  lowStockCount: number;
  todayRevenue: number;
  todayInvoices: number;
  monthRevenue: number;
  monthInvoices: number;
}

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalTables: 0,
    emptyTables: 0,
    busyTables: 0,
    openOrders: 0,
    kitchenPending: 0,
    lowStockCount: 0,
    todayRevenue: 0,
    todayInvoices: 0,
    monthRevenue: 0,
    monthInvoices: 0,
  });
  const [openOrdersList, setOpenOrdersList] = useState<Order[]>([]);
  const [kitchenItems, setKitchenItems] = useState<KitchenItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Ingredient[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const monthStart = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      )
        .toISOString()
        .split('T')[0];

      const results = await Promise.allSettled([
        tablesApi.getAll(),
        ordersApi.getOpen(),
        kitchenApi.getAllItems({ status: 'CHO_CHE_BIEN' }),
        getLowStock(),
        reportsApi.getRevenueSummary(today, today),
        reportsApi.getRevenueSummary(monthStart, today),
        reportsApi.getRevenueByDay(monthStart, today),
      ]);

      const tables: TableType[] =
        results[0].status === 'fulfilled'
          ? (results[0].value as { data: TableType[] }).data || []
          : [];
      const openOrders: Order[] =
        results[1].status === 'fulfilled'
          ? (results[1].value as { data: Order[] }).data || []
          : [];
      const kitchenPending: KitchenItem[] =
        results[2].status === 'fulfilled'
          ? (results[2].value as { data: KitchenItem[] }).data || []
          : [];
      const lowStock: Ingredient[] =
        results[3].status === 'fulfilled'
          ? Array.isArray(results[3].value) ? results[3].value as Ingredient[] : []
          : [];
      const todayRev: RevenueSummary | null =
        results[4].status === 'fulfilled'
          ? (results[4].value as RevenueSummary) || null
          : null;
      const monthRev: RevenueSummary | null =
        results[5].status === 'fulfilled'
          ? (results[5].value as RevenueSummary) || null
          : null;
      const dailyRev: DailyRevenue[] =
        results[6].status === 'fulfilled' && (results[6].value as { daily?: DailyRevenue[] })?.daily
          ? (results[6].value as { daily: DailyRevenue[] }).daily
          : [];

      const emptyTables = tables.filter((t) => t.status === 'TRONG').length;
      const busyTables = tables.filter(
        (t) => t.status === 'CO_KHACH' || t.status === 'DA_DAT',
      ).length;

      setStats({
        totalTables: tables.length,
        emptyTables,
        busyTables,
        openOrders: openOrders.length,
        kitchenPending: kitchenPending.length,
        lowStockCount: lowStock.length,
        todayRevenue: todayRev?.total_revenue || 0,
        todayInvoices: todayRev?.total_invoices || 0,
        monthRevenue: monthRev?.total_revenue || 0,
        monthInvoices: monthRev?.total_invoices || 0,
      });

      setOpenOrdersList(openOrders.slice(0, 5));
      setKitchenItems(kitchenPending.slice(0, 5));
      setLowStockItems(lowStock.slice(0, 5));
      setDailyRevenue(dailyRev);
    } catch {
      // Silent fail - dashboard is best-effort
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      icon: <TableOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      label: 'Quản lý bàn',
      path: '/tables',
    },
    {
      icon: <ShoppingCartOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      label: 'Đơn hàng',
      path: '/orders',
    },
    {
      icon: <CoffeeOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
      label: 'Bếp',
      path: '/kitchen',
    },
    {
      icon: <DollarOutlined style={{ fontSize: 24, color: '#13c2c2' }} />,
      label: 'Thanh toán',
      path: '/invoices',
    },
    {
      icon: <ShopOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      label: 'Kho nguyên liệu',
      path: '/inventory',
    },
    {
      icon: <BarChartOutlined style={{ fontSize: 24, color: '#eb2f96' }} />,
      label: 'Báo cáo',
      path: '/reports/revenue',
    },
  ];

  const openOrderColumns = [
    {
      title: 'Mã đơn',
      dataIndex: 'order_code',
      key: 'order_code',
    },
    {
      title: 'Bàn',
      dataIndex: 'table_name',
      key: 'table_name',
    },
    {
      title: 'Thời gian',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (val: string) =>
        val
          ? new Date(val).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '-',
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <Title level={4} style={{ marginBottom: 4 }}>
        Xin chào, {user?.staff?.fullName || user?.username || 'Admin'}!
      </Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Tổng quan nhà hàng hôm nay
      </Text>

      {/* Stats Cards Row 1 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable size="small">
            <Statistic
              title="Bàn trống"
              value={stats.emptyTables}
              suffix={`/ ${stats.totalTables}`}
              valueStyle={{ color: '#52c41a' }}
              prefix={<TableOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable size="small">
            <Statistic
              title="Đơn hàng chờ"
              value={stats.openOrders}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable size="small">
            <Statistic
              title="Món cần chế biến"
              value={stats.kitchenPending}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<CoffeeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable size="small">
            <Statistic
              title="Nguyên liệu sắp hết"
              value={stats.lowStockCount}
              valueStyle={{
                color: stats.lowStockCount > 0 ? '#ff4d4f' : '#52c41a',
              }}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Stats Cards Row 2 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable size="small">
            <Statistic
              title="Doanh thu hôm nay"
              value={stats.todayRevenue}
              formatter={(value) => formatCurrency(value as number)}
              valueStyle={{ color: '#13c2c2' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable size="small">
            <Statistic
              title="Doanh thu tháng"
              value={stats.monthRevenue}
              formatter={(value) => formatCurrency(value as number)}
              valueStyle={{ color: '#eb2f96' }}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable size="small">
            <Statistic
              title="Hóa đơn tháng"
              value={stats.monthInvoices}
              valueStyle={{ color: '#faad14' }}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions + Attention */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card title="Thao tác nhanh" size="small">
            <List
              dataSource={quickActions}
              renderItem={(item) => (
                <List.Item
                  style={{ cursor: 'pointer', padding: '8px 0' }}
                  onClick={() => navigate(item.path)}
                >
                  <Space>
                    {item.icon}
                    <Text>{item.label}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            title={
              <Space>
                <ShoppingCartOutlined />
                <span>Đơn hàng chờ xử lý</span>
                {stats.openOrders > 0 && (
                  <Badge
                    count={stats.openOrders}
                    style={{ backgroundColor: '#1890ff' }}
                  />
                )}
              </Space>
            }
            size="small"
          >
            {openOrdersList.length > 0 ? (
              <Table
                columns={openOrderColumns}
                dataSource={openOrdersList}
                rowKey="id"
                pagination={false}
                size="small"
              />
            ) : (
              <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                <CheckCircleOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                <div>Không có đơn hàng chờ</div>
              </div>
            )}
            {stats.openOrders > 5 && (
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <Button
                  type="link"
                  size="small"
                  onClick={() => navigate('/orders')}
                >
                  Xem tất cả ({stats.openOrders})
                </Button>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            title={
              <Space>
                <CoffeeOutlined />
                <span>Món cần chế biến</span>
                {stats.kitchenPending > 0 && (
                  <Badge
                    count={stats.kitchenPending}
                    style={{ backgroundColor: '#fa8c16' }}
                  />
                )}
              </Space>
            }
            size="small"
          >
            {kitchenItems.length > 0 ? (
              <List
                dataSource={kitchenItems}
                renderItem={(item: KitchenItem) => (
                  <List.Item>
                    <Text>{item.menu_item_name}</Text>
                    <Tag color="orange">x{item.quantity}</Tag>
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                <CheckCircleOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                <div>Bếp đã xong hết</div>
              </div>
            )}
            {stats.kitchenPending > 5 && (
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <Button
                  type="link"
                  size="small"
                  onClick={() => navigate('/kitchen')}
                >
                  Xem tất cả ({stats.kitchenPending})
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card
          title={
            <Space>
              <AlertOutlined style={{ color: '#ff4d4f' }} />
              <span style={{ color: '#ff4d4f' }}>Nguyên liệu sắp hết</span>
            </Space>
          }
          size="small"
          style={{ marginBottom: 24, border: '1px solid #ffccc7' }}
        >
          <List
            dataSource={lowStockItems}
            renderItem={(item: Ingredient) => (
              <List.Item
                actions={[
                  <Button
                    key="restock"
                    type="link"
                    size="small"
                    onClick={() => navigate('/inventory')}
                  >
                    Nhập kho
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={`Hiện có: ${item.currentStock} ${item.unit} | Tối thiểu: ${item.minStock} ${item.unit}`}
                />
                {item.currentStock === 0 ? (
                  <Badge status="error" text="Hết hàng" />
                ) : (
                  <Badge status="warning" text="Sắp hết" />
                )}
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Daily Revenue Chart (CSS bar chart) */}
      {dailyRevenue.length > 0 && (
        <Card
          title="Doanh thu 7 ngày gần nhất"
          size="small"
          style={{ marginBottom: 24 }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              height: 200,
              gap: 8,
              padding: '0 16px',
            }}
          >
            {dailyRevenue.slice(-7).map((day) => {
              const maxRevenue = Math.max(
                ...dailyRevenue.slice(-7).map((d) => d.revenue),
              );
              const height =
                maxRevenue > 0 ? (day.revenue / maxRevenue) * 180 : 0;
              const date = new Date(day.date);
              const label = `${date.getDate()}/${date.getMonth() + 1}`;
              return (
                <div
                  key={day.date}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      height: Math.max(height, 2),
                      backgroundColor: '#1890ff',
                      borderRadius: '4px 4px 0 0',
                      minHeight: 2,
                    }}
                    title={formatCurrency(day.revenue)}
                  />
                  <div style={{ fontSize: 11, marginTop: 4, color: '#666' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 10, color: '#999' }}>
                    {day.revenue > 0
                      ? `${(day.revenue / 1000).toFixed(0)}k`
                      : '0'}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Divider />

      {/* Footer */}
      <div style={{ textAlign: 'center', color: '#999', fontSize: 12 }}>
        <Text type="secondary">
          Quản lý nhà hàng © {new Date().getFullYear()} | API:{' '}
          {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5011/api'}
        </Text>
      </div>
    </div>
  );
}
