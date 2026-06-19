import { useState, useEffect, useCallback } from 'react';
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
  Upload,
  Image,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { menuItemsApi } from '../api/menu-items.api';
import { menuCategoriesApi } from '../api/menu-categories.api';
import { ensureArray } from '../api/unwrap';
import type {
  MenuItem,
  MenuCategory,
  MenuItemStatus,
  CreateMenuItemRequest,
} from '../types/sprint2.types';

const { Title } = Typography;
const { TextArea } = Input;

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5011/api';
const UPLOAD_URL = API_BASE.replace(/\/api\/?$/, '') + '/uploads/menu-items/';

const STATUS_OPTIONS: { value: MenuItemStatus; label: string; color: string }[] = [
  { value: 'DANG_BAN', label: 'Đang bán', color: 'green' },
  { value: 'HET_MON', label: 'Hết món', color: 'orange' },
  { value: 'NGUNG_BAN', label: 'Ngừng bán', color: 'red' },
];

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

export function MenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<number | undefined>();
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await menuItemsApi.getAll({
        category_id: filterCategory,
        status: filterStatus,
      });
      // response is ApiResponse<MenuItem[]>, response.data = MenuItem[]
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch {
      message.error('Không thể tải danh sách món ăn');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filterCategory, filterStatus]);

  const fetchCategories = async () => {
    try {
      const response = await menuCategoriesApi.getAll();
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch {
      message.error('Không thể tải danh sách danh mục');
      setCategories([]);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
  }, [fetchItems]);

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

  const handleUpload = async (file: File): Promise<boolean> => {
    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      message.error('Chỉ chấp nhận file jpg, jpeg, png, webp');
      return false;
    }
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      message.error('File không được vượt quá 3MB');
      return false;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('access_token') || '';
      const response = await fetch(`${API_BASE}/uploads/menu-items`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload thất bại');
      }

      const result = await response.json();
      const imageUrl = result.data?.url || result.url;
      form.setFieldsValue({ image_url: imageUrl });
      message.success('Upload ảnh thành công');
      return true;
    } catch (error: unknown) {
      const err = error as { message?: string };
      message.error(err?.message || 'Upload ảnh thất bại');
      return false;
    } finally {
      setUploading(false);
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

  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return UPLOAD_URL + url.replace(/^\/uploads\/menu-items\//, '');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Ảnh',
      key: 'image',
      width: 80,
      render: (_: unknown, record: MenuItem) => {
        const imgUrl = getImageUrl(record.image_url);
        return imgUrl ? (
          <Image
            src={imgUrl}
            alt={record.name}
            width={50}
            height={50}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F/PQAJhAN3ePVXmwAAAABJRU5ErkJggg=="
          />
        ) : (
          <span style={{ color: '#999', fontSize: 12 }}>Chưa có ảnh</span>
        );
      },
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
        dataSource={ensureArray(items)}
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
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
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

          {/* Image Upload */}
          <Form.Item label="Ảnh món ăn">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Upload
                accept="image/jpeg,image/jpg,image/png,image/webp"
                showUploadList={false}
                beforeUpload={async (file) => {
                  await handleUpload(file);
                  return false; // Prevent antd upload
                }}
                disabled={uploading}
              >
                <Button icon={<UploadOutlined />} loading={uploading} disabled={uploading}>
                  {uploading ? 'Đang upload...' : 'Chọn ảnh (jpg, png, webp, max 3MB)'}
                </Button>
              </Upload>
              <Form.Item name="image_url" noStyle>
                <Input
                  placeholder="Hoặc nhập URL ảnh thủ công"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Space>
          </Form.Item>

          {/* Image preview */}
          <Form.Item shouldUpdate={(prev, cur) => prev.image_url !== cur.image_url} noStyle>
            {() => {
              const imageUrl = form.getFieldValue('image_url');
              const fullUrl = getImageUrl(imageUrl);
              return fullUrl ? (
                <div style={{ marginBottom: 16 }}>
                  <Image
                    src={fullUrl}
                    alt="Preview"
                    width={120}
                    height={120}
                    style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #d9d9d9' }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F/PQAJhAN3ePVXmwAAAABJRU5ErkJggg=="
                  />
                </div>
              ) : null;
            }}
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
