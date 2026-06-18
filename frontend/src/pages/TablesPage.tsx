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
import { tablesApi } from '../api/tables.api';
import { tableAreasApi } from '../api/table-areas.api';
import type {
  Table as TableType,
  TableArea,
  TableStatus,
  CreateTableRequest,
} from '../types/sprint2.types';

const { Title } = Typography;

const STATUS_OPTIONS: { value: TableStatus; label: string; color: string }[] = [
  { value: 'TRONG', label: 'Trống', color: 'green' },
  { value: 'DA_DAT', label: 'Đã đặt', color: 'orange' },
  { value: 'CO_KHACH', label: 'Có khách', color: 'blue' },
  { value: 'DANG_DON', label: 'Đang dọn', color: 'purple' },
  { value: 'BAO_TRI', label: 'Bảo trì', color: 'red' },
];

export function TablesPage() {
  const [tables, setTables] = useState<TableType[]>([]);
  const [areas, setAreas] = useState<TableArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTable, setEditingTable] = useState<TableType | null>(null);
  const [filterArea, setFilterArea] = useState<number | undefined>();
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [form] = Form.useForm();

  const fetchTables = async () => {
    setLoading(true);
    try {
      const response = await tablesApi.getAll({
        table_area_id: filterArea,
        status: filterStatus,
      });
      setTables(response.data);
    } catch {
      message.error('Không thể tải danh sách bàn');
    } finally {
      setLoading(false);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await tableAreasApi.getAll();
      setAreas(response.data);
    } catch {
      message.error('Không thể tải danh sách khu vực');
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  useEffect(() => {
    fetchTables();
  }, [filterArea, filterStatus]);

  const handleCreate = () => {
    setEditingTable(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (table: TableType) => {
    setEditingTable(table);
    form.setFieldsValue({
      table_area_id: table.table_area_id,
      name: table.name,
      capacity: table.capacity,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await tablesApi.delete(id);
      message.success('Xóa bàn thành công');
      fetchTables();
    } catch {
      message.error('Không thể xóa bàn');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data: CreateTableRequest = {
        table_area_id: values.table_area_id,
        name: values.name,
        capacity: values.capacity || 4,
      };

      if (editingTable) {
        await tablesApi.update(editingTable.id, data);
        message.success('Cập nhật bàn thành công');
      } else {
        await tablesApi.create(data);
        message.success('Tạo bàn thành công');
      }

      setModalVisible(false);
      fetchTables();
    } catch {
      message.error('Có lỗi xảy ra');
    }
  };

  const getStatusTag = (status: TableStatus) => {
    const option = STATUS_OPTIONS.find((s) => s.value === status);
    return option ? <Tag color={option.color}>{option.label}</Tag> : <Tag>{status}</Tag>;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên bàn',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Khu vực',
      key: 'area',
      render: (_: unknown, record: TableType) =>
        record.table_area?.name || areas.find((a) => a.id === record.table_area_id)?.name || '-',
    },
    {
      title: 'Sức chứa',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
      render: (capacity: number) => `${capacity} người`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: TableStatus) => getStatusTag(status),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: TableType) => (
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
          Quản lý bàn
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Thêm bàn
        </Button>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Lọc theo khu vực"
          allowClear
          style={{ width: 200 }}
          value={filterArea}
          onChange={setFilterArea}
          options={areas.map((a) => ({ value: a.id, label: a.name }))}
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
        dataSource={tables}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingTable ? 'Cập nhật bàn' : 'Thêm bàn mới'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editingTable ? 'Cập nhật' : 'Tạo'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="table_area_id"
            label="Khu vực"
            rules={[{ required: true, message: 'Vui lòng chọn khu vực' }]}
          >
            <Select
              placeholder="Chọn khu vực"
              options={areas.map((a) => ({ value: a.id, label: a.name }))}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên bàn"
            rules={[{ required: true, message: 'Vui lòng nhập tên bàn' }]}
          >
            <Input placeholder="VD: B01, VIP01..." />
          </Form.Item>
          <Form.Item name="capacity" label="Sức chứa">
            <InputNumber min={1} max={50} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
