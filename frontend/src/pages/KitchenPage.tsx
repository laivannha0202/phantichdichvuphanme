import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Typography,
  message,
  Space,
  Tag,
  Card,
  Select,
  Statistic,
  Row,
  Col,
  Popconfirm,
} from 'antd';
import {
  CoffeeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { kitchenApi } from '../api/kitchen.api';
import { ensureArray } from '../api/unwrap';
import type { KitchenItem, KitchenItemStatus } from '../types/sprint5.types';

const { Title, Text } = Typography;

const STATUS_CONFIG: Record<
  KitchenItemStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  CHO_CHE_BIEN: {
    label: 'Chờ chế biến',
    color: 'orange',
    icon: <ClockCircleOutlined />,
  },
  DANG_CHE_BIEN: {
    label: 'Đang chế biến',
    color: 'processing',
    icon: <ThunderboltOutlined />,
  },
  HOAN_THANH: {
    label: 'Hoàn thành',
    color: 'success',
    icon: <CheckCircleOutlined />,
  },
};

const STATUS_OPTIONS = [
  { value: undefined, label: 'Tất cả' },
  { value: 'CHO_CHE_BIEN', label: 'Chờ chế biến' },
  { value: 'DANG_CHE_BIEN', label: 'Đang chế biến' },
  { value: 'HOAN_THANH', label: 'Hoàn thành' },
];

export function KitchenPage() {
  const [items, setItems] = useState<KitchenItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined,
  );

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await kitchenApi.getAllItems({
        status: filterStatus,
      });
      // response is ApiResponse<KitchenItem[]>, response.data = KitchenItem[]
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch {
      message.error('Không thể tải danh sách món cần chế biến');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
  }, [fetchItems]);

  const handleUpdateStatus = async (
    itemId: number,
    newStatus: KitchenItemStatus,
  ) => {
    try {
      await kitchenApi.updateItemStatus(itemId, { status: newStatus });
      message.success('Cập nhật trạng thái thành công');
      fetchItems();
    } catch {
      message.error('Không thể cập nhật trạng thái');
    }
  };

  const getStatusTag = (status: KitchenItemStatus) => {
    const config = STATUS_CONFIG[status];
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.label}
      </Tag>
    );
  };

  const getActionForStatus = (record: KitchenItem) => {
    switch (record.status) {
      case 'CHO_CHE_BIEN':
        return (
          <Popconfirm
            title="Bắt đầu chế biến món này?"
            onConfirm={() => handleUpdateStatus(record.id, 'DANG_CHE_BIEN')}
            okText="Bắt đầu"
            cancelText="Hủy"
          >
            <Button type="primary" size="small" icon={<ThunderboltOutlined />}>
              Bắt đầu
            </Button>
          </Popconfirm>
        );
      case 'DANG_CHE_BIEN':
        return (
          <Popconfirm
            title="Món đã hoàn thành?"
            onConfirm={() => handleUpdateStatus(record.id, 'HOAN_THANH')}
            okText="Hoàn thành"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
            >
              Hoàn thành
            </Button>
          </Popconfirm>
        );
      case 'HOAN_THANH':
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Đã xong
          </Tag>
        );
      default:
        return null;
    }
  };

  const columns = [
    {
      title: 'Đơn hàng',
      dataIndex: 'order_code',
      key: 'order_code',
      width: 150,
      render: (code: string) => <Text strong>{code}</Text>,
    },
    {
      title: 'Bàn',
      dataIndex: 'table_name',
      key: 'table_name',
      width: 100,
      render: (name: string) => <Tag>{name}</Tag>,
    },
    {
      title: 'Món',
      dataIndex: 'menu_item_name',
      key: 'menu_item_name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'SL',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 70,
      align: 'center' as const,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 200,
      render: (note: string | null) => note || <Text type="secondary">-</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: KitchenItemStatus) => getStatusTag(status),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 140,
      render: (_: unknown, record: KitchenItem) => getActionForStatus(record),
    },
  ];

  // Thống kê
  const stats = {
    total: items.length,
    pending: items.filter((i) => i.status === 'CHO_CHE_BIEN').length,
    cooking: items.filter((i) => i.status === 'DANG_CHE_BIEN').length,
    done: items.filter((i) => i.status === 'HOAN_THANH').length,
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          <CoffeeOutlined /> Bếp xử lý món
        </Title>
        <Button onClick={fetchItems} loading={loading}>
          Làm mới
        </Button>
      </div>

      {/* Thống kê nhanh */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Statistic
            title="Tổng món"
            value={stats.total}
            prefix={<CoffeeOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Chờ chế biến"
            value={stats.pending}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#fa8c16' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Đang chế biến"
            value={stats.cooking}
            prefix={<ThunderboltOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Hoàn thành"
            value={stats.done}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
      </Row>

      {/* Filter */}
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          style={{ width: 200 }}
          value={filterStatus}
          onChange={setFilterStatus}
          options={STATUS_OPTIONS}
        />
      </Space>

      {/* Bảng danh sách */}
      <Table
        columns={columns}
        dataSource={ensureArray(items)}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </Card>
  );
}
