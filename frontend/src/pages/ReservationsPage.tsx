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
  DatePicker,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  CalendarOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { reservationsApi } from '../api/reservations.api';
import { tablesApi } from '../api/tables.api';
import type {
  Reservation,
  ReservationStatus,
} from '../types/sprint6.types';
import { RESERVATION_STATUS_CONFIG } from '../types/sprint6.types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface TableOption {
  id: number;
  name: string;
  capacity: number;
  status: string;
}

export function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<TableOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined,
  );
  const [filterDate, setFilterDate] = useState<dayjs.Dayjs | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null);
  const [form] = Form.useForm();

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const params: { status?: string; date?: string } = {};
      if (filterStatus) params.status = filterStatus;
      if (filterDate) params.date = filterDate.format('YYYY-MM-DD');

      const response = await reservationsApi.getAll(params);
      setReservations(response.data);
    } catch {
      message.error('Không thể tải danh sách đặt bàn');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterDate]);

  const fetchTables = useCallback(async () => {
    try {
      const response = await tablesApi.getAll();
      setTables(response.data);
    } catch {
      // Ignore error
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReservations();
    fetchTables();
  }, [fetchReservations, fetchTables]);

  const handleCreate = () => {
    setEditingReservation(null);
    form.resetFields();
    form.setFieldsValue({
      reservation_time: dayjs().add(1, 'hour').minute(0),
    });
    setIsModalOpen(true);
  };

  const handleEdit = (record: Reservation) => {
    setEditingReservation(record);
    form.setFieldsValue({
      ...record,
      reservation_time: dayjs(record.reservation_time),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        reservation_time: values.reservation_time.toISOString(),
      };

      if (editingReservation) {
        await reservationsApi.update(editingReservation.id, data);
        message.success('Cập nhật đặt bàn thành công');
      } else {
        await reservationsApi.create(data);
        message.success('Tạo đặt bàn thành công');
      }

      setIsModalOpen(false);
      fetchReservations();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      if (err.response?.data?.message) {
        message.error(err.response.data.message);
      }
    }
  };

  const handleConfirm = async (id: number) => {
    try {
      await reservationsApi.confirm(id);
      message.success('Xác nhận đặt bàn thành công');
      fetchReservations();
    } catch {
      message.error('Không thể xác nhận đặt bàn');
    }
  };

  const handleCheckIn = async (id: number) => {
    try {
      await reservationsApi.checkIn(id);
      message.success('Check-in thành công');
      fetchReservations();
    } catch {
      message.error('Không thể check-in');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await reservationsApi.cancel(id);
      message.success('Hủy đặt bàn thành công');
      fetchReservations();
    } catch {
      message.error('Không thể hủy đặt bàn');
    }
  };

  const handleNoShow = async (id: number) => {
    try {
      await reservationsApi.noShow(id);
      message.success('Đánh dấu khách không đến thành công');
      fetchReservations();
    } catch {
      message.error('Không thể đánh dấu khách không đến');
    }
  };

  const getStatusTag = (status: ReservationStatus) => {
    const config = RESERVATION_STATUS_CONFIG[status];
    return <Tag color={config.color}>{config.label}</Tag>;
  };

  const getActions = (record: Reservation) => {
    const actions: React.ReactNode[] = [];

    if (record.status === 'CHO_XAC_NHAN') {
      actions.push(
        <Popconfirm
          key="confirm"
          title="Xác nhận đặt bàn này?"
          onConfirm={() => handleConfirm(record.id)}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
          >
            Xác nhận
          </Button>
        </Popconfirm>,
      );
    }

    if (record.status === 'DA_XAC_NHAN') {
      actions.push(
        <Popconfirm
          key="checkin"
          title="Khách đã đến nhận bàn?"
          onConfirm={() => handleCheckIn(record.id)}
          okText="Nhận bàn"
          cancelText="Hủy"
        >
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            style={{ background: '#52c41a', borderColor: '#52c41a' }}
          >
            Nhận bàn
          </Button>
        </Popconfirm>,
      );
    }

    if (['CHO_XAC_NHAN', 'DA_XAC_NHAN'].includes(record.status)) {
      actions.push(
        <Popconfirm
          key="cancel"
          title="Hủy đặt bàn này?"
          onConfirm={() => handleCancel(record.id)}
          okText="Hủy"
          cancelText="Không"
        >
          <Button
            danger
            size="small"
            icon={<StopOutlined />}
          >
            Hủy
          </Button>
        </Popconfirm>,
      );
    }

    if (record.status === 'DA_XAC_NHAN') {
      actions.push(
        <Popconfirm
          key="noshow"
          title="Đánh dấu khách không đến?"
          onConfirm={() => handleNoShow(record.id)}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <Button
            danger
            size="small"
            icon={<CloseCircleOutlined />}
          >
            Không đến
          </Button>
        </Popconfirm>,
      );
    }

    if (record.status === 'CHO_XAC_NHAN') {
      actions.push(
        <Button
          key="edit"
          size="small"
          onClick={() => handleEdit(record)}
        >
          Sửa
        </Button>,
      );
    }

    return actions;
  };

  const columns = [
    {
      title: 'Mã đặt bàn',
      dataIndex: 'reservation_code',
      key: 'reservation_code',
      width: 150,
      render: (code: string) => <Text strong>{code}</Text>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer_name',
      key: 'customer_name',
      width: 150,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'customer_phone',
      key: 'customer_phone',
      width: 120,
    },
    {
      title: 'Số khách',
      dataIndex: 'guest_count',
      key: 'guest_count',
      width: 80,
      align: 'center' as const,
    },
    {
      title: 'Bàn',
      dataIndex: ['table', 'name'],
      key: 'table_name',
      width: 100,
      render: (name: string) => <Tag>{name}</Tag>,
    },
    {
      title: 'Thời gian đặt',
      dataIndex: 'reservation_time',
      key: 'reservation_time',
      width: 180,
      render: (time: string) => dayjs(time).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: ReservationStatus) => getStatusTag(status),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 200,
      render: (note: string | null) => note || <Text type="secondary">-</Text>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 280,
      render: (_: unknown, record: Reservation) => (
        <Space size="small">{getActions(record)}</Space>
      ),
    },
  ];

  // Thống kê
  const stats = {
    total: reservations.length,
    choXacNhan: reservations.filter((r) => r.status === 'CHO_XAC_NHAN').length,
    daXacNhan: reservations.filter((r) => r.status === 'DA_XAC_NHAN').length,
    daNhanBan: reservations.filter((r) => r.status === 'DA_NHAN_BAN').length,
    hoanThanh: reservations.filter((r) => r.status === 'HOAN_THANH').length,
    khongDen: reservations.filter((r) => r.status === 'KHONG_DEN').length,
    daHuy: reservations.filter((r) => r.status === 'DA_HUY').length,
  };

  return (
    <Card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          <CalendarOutlined /> Đặt bàn trước
        </Title>
        <Space>
          <Button onClick={fetchReservations} loading={loading}>
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Tạo đặt bàn
          </Button>
        </Space>
      </div>

      {/* Thống kê nhanh */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Statistic title="Tổng" value={stats.total} />
        </Col>
        <Col span={4}>
          <Statistic
            title="Chờ xác nhận"
            value={stats.choXacNhan}
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Đã xác nhận"
            value={stats.daXacNhan}
            valueStyle={{ color: '#1890ff' }}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Đã nhận bàn"
            value={stats.daNhanBan}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Không đến"
            value={stats.khongDen}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Col>
        <Col span={4}>
          <Statistic
            title="Đã hủy"
            value={stats.daHuy}
            valueStyle={{ color: '#ff4d4f' }}
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
          options={[
            { value: undefined, label: 'Tất cả' },
            ...Object.entries(RESERVATION_STATUS_CONFIG).map(([key, val]) => ({
              value: key,
              label: val.label,
            })),
          ]}
        />
        <DatePicker
          placeholder="Lọc theo ngày"
          value={filterDate}
          onChange={setFilterDate}
          format="DD/MM/YYYY"
        />
      </Space>

      {/* Bảng danh sách */}
      <Table
        columns={columns}
        dataSource={reservations}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Modal tạo/sửa đặt bàn */}
      <Modal
        title={editingReservation ? 'Sửa đặt bàn' : 'Tạo đặt bàn mới'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="table_id"
            label="Bàn"
            rules={[{ required: true, message: 'Vui lòng chọn bàn' }]}
          >
            <Select
              placeholder="Chọn bàn"
              options={tables
                .filter((t) => t.status !== 'BAO_TRI')
                .map((t) => ({
                  value: t.id,
                  label: `${t.name} (${t.capacity} ghế)`,
                }))}
            />
          </Form.Item>

          <Form.Item
            name="customer_name"
            label="Tên khách hàng"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách' }]}
          >
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>

          <Form.Item
            name="customer_phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              {
                pattern: /^(0|\+84)[0-9]{9,10}$/,
                message: 'Số điện thoại không hợp lệ',
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="guest_count"
            label="Số lượng khách"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng khách' },
            ]}
          >
            <InputNumber min={1} max={50} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="reservation_time"
            label="Thời gian đặt"
            rules={[
              { required: true, message: 'Vui lòng chọn thời gian đặt' },
            ]}
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              style={{ width: '100%' }}
              disabledDate={(current) =>
                current && current < dayjs().startOf('day')
              }
            />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <TextArea rows={3} placeholder="Nhập ghi chú (tùy chọn)" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
