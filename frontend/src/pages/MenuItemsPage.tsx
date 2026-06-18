import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Typography,
  message,
  Popconfirm,
  Tag,
  Card,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { menuItemsApi } from '../api/menu-items.api';
import { menuCategoriesApi } from '../api/menu-categories.api';
import type {
  MenuItem,
  MenuCategory,
  MenuItemStatus,
  CreateMenuItemRequest,
} from '../types/sprint2.types';

const { Title } = Typography;
const { TextArea } = Input;

const STATUS_OPTIONS: { value: MenuItemStatus; label: string; color: string }[] = [
  { value: 'DANG_BAN', label: 'Đang bán', color: 'green' },
  { value: 'HET_MON', label: 'Hết món', color: 'orange' },
  { value: 'NGUNG_BAN', label: 'Ngừng bán', color: 'red' },
];

export function MenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<number | undefined>();
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [form] = Form.useForm();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await menuItemsApi.getAll({
        category_id: filterCategory,
        status: filterStatus,
      });
      setItems(response.data);
    } catch {
      message.error('Không thể tải danh sách món ăn');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await menuCategoriesApi.getAll();
      setCategories(response.data);
    } catch {
      message.error('Không thể tải danh sách danh mục');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [filterCategory, filterStatus]);

  const handleCreate = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    form.setFieldsValue({
      category_id: item.category_id,
      name: item.name,
      description: item.description,
      price: item.price,
      cost_price: item.cost_price,
      image_url: item.image_url,
      status: item.status,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await menuItemsApi.delete(id);
      message.success('Xóa món ăn thành công');
      fetchItems();
    } catch {
      message.error('Không thể xóa món ăn');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data: CreateMenuItemRequest = {
        category_id: values.category_id,
        name: values.name,
        description: values.description,
        price: values.price,
        cost_price: values.cost_price,
        image_url: values.image_url,
        status: values.status || 'DANG_BAN',
      };

      if (editingItem) {
        await menuItemsApi.update(editingItem.id, data);
        message.success('Cập nhật món ăn thành công');
      } else {
        await menuItemsApi.create(data);
        message.success('Tạo món ăn thành công');
      }

      setModalVisible(false);
      fetchItems();
    } catch {
      message.error('Có lỗi xảy ra');
    }
  };

  const getStatusTag = (status: MenuItemStatus) => {
    const option = STATUS_OPTIONS.find((s) => s.value === status);
    return option ? <Tag color={option.color}>{option.label}</Tag> : <Tag>{status}</Tag>;
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên món',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Danh mục',
      key: 'category',
      render: (_: unknown, record: MenuItem) =>
        record.category?.name ||
        categories.find((c) => c.id === record.category_id)?.name ||
        '-',
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatPrice(price),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: MenuItemStatus) => getStatusTag(status),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: MenuItem) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Quản lý món ăn
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Thêm món ăn
        </Button>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Lọc theo danh mục"
          allowClear
          style={{ width: 200 }}
          value={filterCategory}
          onChange={setFilterCategory}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          style={{ width: 200 }}
          value={filterStatus}
          onChange={setFilterStatus}
          options={STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={items}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingItem ? 'Cập nhật món ăn' : 'Thêm món ăn mới'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editingItem ? 'Cập nhật' : 'Tạo'}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="category_id"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select
              placeholder="Chọn danh mục"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên món"
            rules={[{ required: true, message: 'Vui lòng nhập tên món' }]}
          >
            <Input placeholder="VD: Phở Bò, Bún Chả..." />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <TextArea rows={2} placeholder="Mô tả món ăn..." />
          </Form.Item>
          <Space style={{ width: '100%' }}>
            <Form.Item
              name="price"
              label="Giá bán"
              rules={[{ required: true, message: 'Vui lòng nhập giá bán' }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="Giá bán" />
            </Form.Item>
            <Form.Item name="cost_price" label="Giá vốn" style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: '100%' }} placeholder="Giá vốn" />
            </Form.Item>
          </Space>
          <Form.Item name="image_url" label="URL ảnh">
            <Input placeholder="/images/pho-bo.jpg" />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select
              placeholder="Chọn trạng thái"
              options={STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
