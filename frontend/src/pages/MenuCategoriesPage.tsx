import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Typography,
  message,
  Popconfirm,
  Card,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { menuCategoriesApi } from '../api/menu-categories.api';
import type { MenuCategory, CreateMenuCategoryRequest } from '../types/sprint2.types';

const { Title } = Typography;

export function MenuCategoriesPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await menuCategoriesApi.getAll();
      setCategories(response.data);
    } catch {
      message.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (category: MenuCategory) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      sort_order: category.sort_order,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await menuCategoriesApi.delete(id);
      message.success('Xóa danh mục thành công');
      fetchCategories();
    } catch {
      message.error('Không thể xóa danh mục');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data: CreateMenuCategoryRequest = {
        name: values.name,
        sort_order: values.sort_order || 0,
      };

      if (editingCategory) {
        await menuCategoriesApi.update(editingCategory.id, data);
        message.success('Cập nhật danh mục thành công');
      } else {
        await menuCategoriesApi.create(data);
        message.success('Tạo danh mục thành công');
      }

      setModalVisible(false);
      fetchCategories();
    } catch {
      message.error('Có lỗi xảy ra');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Thứ tự',
      dataIndex: 'sort_order',
      key: 'sort_order',
      width: 100,
    },
    {
      title: 'Số món',
      key: 'item_count',
      width: 100,
      render: (_: unknown, record: MenuCategory) =>
        record.menu_items?.length ?? '-',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: MenuCategory) => (
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
          Quản lý danh mục thực đơn
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Thêm danh mục
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingCategory ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editingCategory ? 'Cập nhật' : 'Tạo'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input placeholder="VD: Món khai vị, Đồ uống..." />
          </Form.Item>
          <Form.Item name="sort_order" label="Thứ tự hiển thị">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
