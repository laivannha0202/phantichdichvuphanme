import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Input,
  Space,
  Typography,
  message,
  Popconfirm,
  Tag,
  Card,
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  StopOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { ordersApi } from '../api/orders.api';
import { ensureArray } from '../api/unwrap';
import type { Order, OrderStatus } from '../types/sprint3.types';

const { Title, Text } = Typography;
const { TextArea } = Input;

const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'DANG_CHUAN_BI', label: 'Đang chuẩn bị', color: 'processing' },
  { value: 'DANG_PHUC_VU', label: 'Đang phục vụ', color: 'success' },
  { value: 'HOAN_THANH', label: 'Hoàn thành', color: 'default' },
  { value: 'DA_HUY', label: 'Đã hủy', color: 'error' },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ordersApi.getAll({ status: filterStatus });
      // response is ApiResponse<Order[]>, response.data = Order[]
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch {
      message.error('Không thể tải danh sách đơn hàng');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async (id: number) => {
    try {
      await ordersApi.updateStatus(id, { status: 'DA_HUY' });
      message.success('Đã hủy đơn hàng');
      fetchOrders();
    } catch {
      message.error('Không thể hủy đơn hàng');
    }
  };

  const handleCreateOrder = async () => {
    try {
      const values = await form.validateFields();
      await ordersApi.create({
        table_id: values.table_id,
        note: values.note,
      });
      message.success('Tạo đơn hàng thành công');
      setCreateModalVisible(false);
      form.resetFields();
      fetchOrders();
    } catch {
      message.error('Không thể tạo đơn hàng');
    }
  };

  const getStatusTag = (status: OrderStatus) => {
    const option = ORDER_STATUS_OPTIONS.find((s) => s.value === status);
    return option ? <Tag color={option.color}>{option.label}</Tag> : <Tag>{status}</Tag>;
  };

  const canCancel = (status: OrderStatus) =>
    status === 'DANG_CHUAN_BI' || status === 'DANG_PHUC_VU';

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'order_code',
      key: 'order_code',
      width: 160,
      render: (code: string) => <Text strong>{code}</Text>,
    },
    {
      title: 'Bàn',
      key: 'table',
      render: (_: unknown, record: Order) => record.table?.name || '-',
    },
    {
      title: 'Số món',
      key: 'item_count',
      render: (_: unknown, record: Order) =>
        record.items?.filter((i) => i.deleted_at === null).length || 0,
    },
    {
      title: 'Tổng tiền',
      key: 'total',
      render: (_: unknown, record: Order) => {
        const total =
          record.items
            ?.filter((i) => i.deleted_at === null)
            .reduce((sum, i) => sum + i.unit_price * i.quantity, 0) || 0;
        return formatPrice(total);
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => getStatusTag(status),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      render: (_: unknown, record: Order) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/orders/${record.id}`)}
          >
            Chi tiết
          </Button>
          {canCancel(record.status) && (
            <Popconfirm
              title="Bạn có chắc chắn hủy đơn này?"
              onConfirm={() => handleCancelOrder(record.id)}
              okText="Hủy đơn"
              cancelText="Không"
            >
              <Button type="link" danger icon={<StopOutlined />}>
                Hủy
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Quản lý đơn hàng
        </Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchOrders}>
            Tải lại
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
            Tạo đơn mới
          </Button>
        </Space>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          style={{ width: 200 }}
          value={filterStatus}
          onChange={setFilterStatus}
          options={ORDER_STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={ensureArray(orders)}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Tạo đơn hàng mới"
        open={createModalVisible}
        onOk={handleCreateOrder}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        okText="Tạo"
        cancelText="Hủy"
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="table_id"
            label="Bàn"
            rules={[{ required: true, message: 'Vui lòng chọn bàn' }]}
          >
            <Select
              placeholder="Chọn bàn (chỉ hiển thị bàn có khách)"
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <TextArea rows={2} placeholder="Ghi chú cho đơn hàng..." />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
