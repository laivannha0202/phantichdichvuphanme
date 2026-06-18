import { Layout, Menu, Button, Typography, Space } from 'antd';
import {
  DashboardOutlined,
  LogoutOutlined,
  ShopOutlined,
  TableOutlined,
  CoffeeOutlined,
  ShoppingCartOutlined,
  ToolOutlined,
  BarChartOutlined,
  InboxOutlined,
  CalendarOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const roleCode = user?.role?.code;
  const canViewRevenueReport = roleCode === 'QUAN_TRI_HE_THONG' || roleCode === 'QUAN_LY';
  const canViewInventory = roleCode === 'QUAN_TRI_HE_THONG' || roleCode === 'QUAN_LY' || roleCode === 'KHO';
  const canViewStaff = roleCode === 'QUAN_TRI_HE_THONG' || roleCode === 'QUAN_LY';

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/table-areas',
      icon: <TableOutlined />,
      label: 'Khu vực bàn',
    },
    {
      key: '/tables',
      icon: <TableOutlined />,
      label: 'Quản lý bàn',
    },
    {
      key: '/menu/categories',
      icon: <CoffeeOutlined />,
      label: 'Danh mục thực đơn',
    },
    {
      key: '/menu/items',
      icon: <CoffeeOutlined />,
      label: 'Món ăn',
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Đơn hàng',
    },
    {
      key: '/kitchen',
      icon: <ToolOutlined />,
      label: 'Bếp',
    },
    {
      key: '/reservations',
      icon: <CalendarOutlined />,
      label: 'Đặt bàn',
    },
    ...(canViewRevenueReport
      ? [
          {
            key: '/reports/revenue',
            icon: <BarChartOutlined />,
            label: 'Báo cáo doanh thu',
          },
        ]
      : []),
    ...(canViewInventory
      ? [
          {
            key: '/inventory',
            icon: <InboxOutlined />,
            label: 'Kho',
          },
        ]
      : []),
    ...(canViewStaff
      ? [
          {
            key: '/staff-users',
            icon: <TeamOutlined />,
            label: 'Nhân viên & Tài khoản',
          },
        ]
      : []),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="80"
        style={{ background: '#fff' }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <ShopOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          <Text strong style={{ marginLeft: 8, color: '#1890ff' }}>
            Nhà hàng
          </Text>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['/']}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Text strong style={{ fontSize: 16 }}>
            Quản lý nhà hàng
          </Text>
          <Space>
            <Text type="secondary">
              {user?.username}
              {user?.role && (
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  ({user.role.name})
                </Text>
              )}
            </Text>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </Space>
        </Header>

        <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
