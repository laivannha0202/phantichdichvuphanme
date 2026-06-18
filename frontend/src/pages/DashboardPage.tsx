import { Typography, Card, Space, Tag } from 'antd';
import { UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../auth/useAuth';

const { Title, Text } = Typography;

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <Title level={4}>
        Xin chào, {user?.username || 'Admin'}
      </Title>

      <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: 16 }}>
        <Card size="small">
          <Space>
            <UserOutlined />
            <Text>Thông tin tài khoản:</Text>
          </Space>
          <div style={{ marginTop: 8 }}>
            <Text>Username: </Text>
            <Text strong>{user?.username}</Text>
          </div>
          <div>
            <Text>Role: </Text>
            <Tag color="blue">{user?.role?.name || user?.role?.code}</Tag>
          </div>
          {user?.staff && (
            <div>
              <Text>Họ tên: </Text>
              <Text strong>{user.staff.fullName}</Text>
            </div>
          )}
        </Card>

        <Card size="small">
          <Space>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            <Text type="success">Kết nối backend thành công</Text>
          </Space>
          <div style={{ marginTop: 8 }}>
            <Text type="secondary">
              API: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5011/api'}
            </Text>
          </div>
        </Card>
      </Space>
    </div>
  );
}
