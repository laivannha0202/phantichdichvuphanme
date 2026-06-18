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
import { tableAreasApi } from '../api/table-areas.api';
import type { TableArea, CreateTableAreaRequest } from '../types/sprint2.types';

const { Title } = Typography;

export function TableAreasPage() {
  const [areas, setAreas] = useState<TableArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingArea, setEditingArea] = useState<TableArea | null>(null);
  const [form] = Form.useForm();

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const response = await tableAreasApi.getAll();
      setAreas(response.data);
    } catch {
      message.error('Không thể tải danh sách khu vực');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleCreate = () => {
    setEditingArea(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (area: TableArea) => {
    setEditingArea(area);
    form.setFieldsValue({
      name: area.name,
      sort_order: area.sort_order,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await tableAreasApi.delete(id);
      message.success('Xóa khu vực thành công');
      fetchAreas();
    } catch {
      message.error('Không thể xóa khu vực');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data: CreateTableAreaRequest = {
        name: values.name,
        sort_order: values.sort_order || 0,
      };

      if (editingArea) {
        await tableAreasApi.update(editingArea.id, data);
        message.success('Cập nhật khu vực thành công');
      } else {
        await tableAreasApi.create(data);
        message.success('Tạo khu vực thành công');
      }

      setModalVisible(false);
      fetchAreas();
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
      title: 'Tên khu vực',
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
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: TableArea) => (
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
          Quản lý khu vực bàn
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Thêm khu vực
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={areas}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingArea ? 'Cập nhật khu vực' : 'Thêm khu vực mới'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editingArea ? 'Cập nhật' : 'Tạo'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên khu vực"
            rules={[{ required: true, message: 'Vui lòng nhập tên khu vực' }]}
          >
            <Input placeholder="VD: Tầng 1, Phòng VIP..." />
          </Form.Item>
          <Form.Item name="sort_order" label="Thứ tự hiển thị">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
