import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Modal,
  Form,
  Select,
  Input,
  InputNumber,
  Space,
  Typography,
  message,
  Popconfirm,
  Tag,
  Table,
  Divider,
  Empty,
  Spin,
  Descriptions,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  StopOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { ordersApi } from '../api/orders.api';
import { menuItemsApi } from '../api/menu-items.api';
import type { Order, OrderItem, OrderStatus, OrderItemStatus } from '../types/sprint3.types';
import type { MenuItem } from '../types/sprint2.types';

const { Text } = Typography;
const { TextArea } = Input;

const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'DANG_CHUAN_BI', label: 'Đang chuẩn bị', color: 'processing' },
  { value: 'DANG_PHUC_VU', label: 'Đang phục vụ', color: 'success' },
  { value: 'HOAN_THANH', label: 'Hoàn thành', color: 'default' },
  { value: 'DA_HUY', label: 'Đã hủy', color: 'error' },
];

const ITEM_STATUS_OPTIONS: { value: OrderItemStatus; label: string; color: string }[] = [
  { value: 'CHO_CHE_BIEN', label: 'Chờ chế biến', color: 'warning' },
  { value: 'DANG_CHE_BIEN', label: 'Đang chế biến', color: 'processing' },
  { value: 'HOAN_THANH', label: 'Hoàn thành', color: 'success' },
  { value: 'DA_PHUC_VU', label: 'Đã phục vụ', color: 'default' },
  { value: 'DA_HUY', label: 'Đã hủy', color: 'error' },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [editItemModalVisible, setEditItemModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const [addItemForm] = Form.useForm();
  const [editItemForm] = Form.useForm();

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await ordersApi.getOne(parseInt(id, 10));
      setOrder(response.data);
    } catch {
      message.error('Không thể tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchMenuItems = async () => {
    try {
      const response = await menuItemsApi.getAll({ status: 'DANG_BAN' });
      setMenuItems(response.data);
    } catch {
      message.error('Không thể tải danh sách món ăn');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrder();
    fetchMenuItems();
  }, [fetchOrder]);

  const handleUpdateOrderStatus = async (newStatus: OrderStatus) => {
    if (!order) return;
    try {
      await ordersApi.updateStatus(order.id, { status: newStatus });
      message.success('Cập nhật trạng thái thành công');
      fetchOrder();
    } catch {
      message.error('Không thể cập nhật trạng thái');
    }
  };

  const handleAddItem = async () => {
    if (!order) return;
    try {
      const values = await addItemForm.validateFields();
      await ordersApi.addItem(order.id, {
        menu_item_id: values.menu_item_id,
        quantity: values.quantity,
        note: values.note,
      });
      message.success('Thêm món thành công');
      setAddItemModalVisible(false);
      addItemForm.resetFields();
      fetchOrder();
    } catch {
      message.error('Không thể thêm món');
    }
  };

  const handleEditItem = async () => {
    if (!order || !editingItem) return;
    try {
      const values = await editItemForm.validateFields();
      await ordersApi.updateItem(order.id, editingItem.id, {
        quantity: values.quantity,
        note: values.note,
      });
      message.success('Cập nhật món thành công');
      setEditItemModalVisible(false);
      setEditingItem(null);
      fetchOrder();
    } catch {
      message.error('Không thể cập nhật món');
    }
  };

  const handleUpdateItemStatus = async (itemId: number, newStatus: OrderItemStatus) => {
    if (!order) return;
    try {
      await ordersApi.updateItemStatus(order.id, itemId, { status: newStatus });
      message.success('Cập nhật trạng thái món thành công');
      fetchOrder();
    } catch {
      message.error('Không thể cập nhật trạng thái món');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!order) return;
    try {
      await ordersApi.deleteItem(order.id, itemId);
      message.success('Hủy món thành công');
      fetchOrder();
    } catch {
      message.error('Không thể hủy món');
    }
  };

  const getStatusTag = (status: OrderStatus | OrderItemStatus) => {
    const allOptions = [...ORDER_STATUS_OPTIONS, ...ITEM_STATUS_OPTIONS];
    const option = allOptions.find((s) => s.value === status);
    return option ? <Tag color={option.color}>{option.label}</Tag> : <Tag>{status}</Tag>;
  };

  const canTransitionOrderStatus = (current: OrderStatus) => {
    switch (current) {
      case 'DANG_CHUAN_BI':
        return ['DANG_PHUC_VU', 'DA_HUY'];
      case 'DANG_PHUC_VU':
        return ['HOAN_THANH', 'DA_HUY'];
      default:
        return [];
    }
  };

  const canTransitionItemStatus = (current: OrderItemStatus) => {
    switch (current) {
      case 'CHO_CHE_BIEN':
        return ['DANG_CHE_BIEN', 'DA_HUY'];
      case 'DANG_CHE_BIEN':
        return ['HOAN_THANH', 'DA_HUY'];
      case 'HOAN_THANH':
        return ['DA_PHUC_VU'];
      default:
        return [];
    }
  };

  const activeItems = order?.items?.filter((i) => !i.deleted_at) || [];
  const totalAmount = activeItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

  const itemColumns = [
    {
      title: 'Món',
      key: 'name',
      render: (_: unknown, record: OrderItem) =>
        record.menu_item?.name || `Món #${record.menu_item_id}`,
    },
    {
      title: 'SL',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 60,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (price: number) => formatPrice(price),
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_: unknown, record: OrderItem) =>
        formatPrice(record.unit_price * record.quantity),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderItemStatus) => getStatusTag(status),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      render: (note: string | null) => note || '-',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      render: (_: unknown, record: OrderItem) => {
        const transitions = canTransitionItemStatus(record.status);
        return (
          <Space>
            {transitions.length > 0 && (
              <Select
                size="small"
                placeholder="Chuyển trạng thái"
                style={{ width: 140 }}
                onChange={(value) => handleUpdateItemStatus(record.id, value)}
                options={transitions.map((s) => {
                  const opt = ITEM_STATUS_OPTIONS.find((o) => o.value === s);
                  return { value: s, label: opt?.label || s };
                })}
              />
            )}
            {record.status === 'CHO_CHE_BIEN' && (
              <>
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditingItem(record);
                    editItemForm.setFieldsValue({
                      quantity: record.quantity,
                      note: record.note,
                    });
                    setEditItemModalVisible(true);
                  }}
                >
                  Sửa
                </Button>
                <Popconfirm
                  title="Hủy món này?"
                  onConfirm={() => handleRemoveItem(record.id)}
                  okText="Hủy món"
                  cancelText="Không"
                >
                  <Button type="link" danger size="small" icon={<DeleteOutlined />}>
                    Hủy
                  </Button>
                </Popconfirm>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <Card>
        <Empty description="Không tìm thấy đơn hàng" />
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/orders')}
          style={{ marginTop: 16 }}
        >
          Quay lại
        </Button>
      </Card>
    );
  }

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/orders')}
        style={{ marginBottom: 16 }}
      >
        Quay lại danh sách
      </Button>

      <Card title={`Đơn hàng ${order.order_code}`} style={{ marginBottom: 16 }}>
        <Descriptions column={2}>
          <Descriptions.Item label="Bàn">{order.table?.name || '-'}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">{getStatusTag(order.status)}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(order.created_at).toLocaleString('vi-VN')}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">{order.note || '-'}</Descriptions.Item>
        </Descriptions>

        <Divider>Hành động</Divider>
        <Space>
          {canTransitionOrderStatus(order.status).includes('DANG_PHUC_VU') && (
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => handleUpdateOrderStatus('DANG_PHUC_VU')}
            >
              Bắt đầu phục vụ
            </Button>
          )}
          {canTransitionOrderStatus(order.status).includes('HOAN_THANH') && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleUpdateOrderStatus('HOAN_THANH')}
            >
              Hoàn thành
            </Button>
          )}
          {canTransitionOrderStatus(order.status).includes('DA_HUY') && (
            <Popconfirm
              title="Bạn có chắc chắn hủy đơn này?"
              onConfirm={() => handleUpdateOrderStatus('DA_HUY')}
              okText="Hủy đơn"
              cancelText="Không"
            >
              <Button danger icon={<StopOutlined />}>
                Hủy đơn
              </Button>
            </Popconfirm>
          )}
        </Space>
      </Card>

      <Card
        title="Danh sách món"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddItemModalVisible(true)}
            disabled={order.status !== 'DANG_CHUAN_BI' && order.status !== 'DANG_PHUC_VU'}
          >
            Thêm món
          </Button>
        }
      >
        <Table
          columns={itemColumns}
          dataSource={activeItems}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: 'Chưa có món nào' }}
        />
        <Divider />
        <div style={{ textAlign: 'right' }}>
          <Text strong style={{ fontSize: 16 }}>
            Tổng cộng: {formatPrice(totalAmount)}
          </Text>
        </div>
      </Card>

      {/* Add Item Modal */}
      <Modal
        title="Thêm món mới"
        open={addItemModalVisible}
        onOk={handleAddItem}
        onCancel={() => {
          setAddItemModalVisible(false);
          addItemForm.resetFields();
        }}
        okText="Thêm"
        cancelText="Hủy"
        width={500}
      >
        <Form form={addItemForm} layout="vertical">
          <Form.Item
            name="menu_item_id"
            label="Món ăn"
            rules={[{ required: true, message: 'Vui lòng chọn món ăn' }]}
          >
            <Select
              placeholder="Chọn món ăn"
              showSearch
              optionFilterProp="label"
              options={menuItems.map((m) => ({
                value: m.id,
                label: `${m.name} - ${formatPrice(m.price)}`,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
            initialValue={1}
          >
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <TextArea rows={2} placeholder="Ghi chú cho món..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        title="Sửa món"
        open={editItemModalVisible}
        onOk={handleEditItem}
        onCancel={() => {
          setEditItemModalVisible(false);
          setEditingItem(null);
        }}
        okText="Cập nhật"
        cancelText="Hủy"
        width={500}
      >
        <Form form={editItemForm} layout="vertical">
          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
          >
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <TextArea rows={2} placeholder="Ghi chú cho món..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
