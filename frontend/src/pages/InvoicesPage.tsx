import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Card, Tabs, message, Modal } from 'antd';
import { EyeOutlined, CreditCardOutlined, StopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getInvoices, cancelInvoice } from '../api/invoices.api';
import type { Invoice, InvoiceStatus } from '../types/sprint4.types';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

const statusColors: Record<InvoiceStatus, string> = {
  CHUA_THANH_TOAN: 'orange',
  DA_THANH_TOAN: 'green',
  DA_HUY: 'red',
};

const statusLabels: Record<InvoiceStatus, string> = {
  CHUA_THANH_TOAN: 'Chưa thanh toán',
  DA_THANH_TOAN: 'Đã thanh toán',
  DA_HUY: 'Đã hủy',
};

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const fetchInvoices = async (status?: string) => {
    setLoading(true);
    try {
      const data = await getInvoices(status);
      setInvoices(data);
    } catch (error) {
      message.error('Không thể tải danh sách hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(activeTab === 'all' ? undefined : activeTab);
  }, [activeTab]);

  const handleCancel = async (id: number) => {
    Modal.confirm({
      title: 'Xác nhận hủy hóa đơn',
      content: 'Bạn có chắc chắn muốn hủy hóa đơn này?',
      onOk: async () => {
        try {
          await cancelInvoice(id, { reason: 'Hủy theo yêu cầu' });
          message.success('Hủy hóa đơn thành công');
          fetchInvoices(activeTab === 'all' ? undefined : activeTab);
        } catch (error) {
          message.error('Không thể hủy hóa đơn');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Mã HĐ',
      dataIndex: 'invoice_code',
      key: 'invoice_code',
    },
    {
      title: 'Đơn hàng',
      dataIndex: ['order', 'order_code'],
      key: 'order_code',
    },
    {
      title: 'Bàn',
      dataIndex: ['order', 'table', 'name'],
      key: 'table_name',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `${total.toLocaleString('vi-VN')}đ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: InvoiceStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Invoice) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/invoices/${record.id}`)}
          >
            Chi tiết
          </Button>
          {record.status === 'CHUA_THANH_TOAN' && (
            <>
              <Button
                type="link"
                icon={<CreditCardOutlined />}
                onClick={() => navigate(`/invoices/${record.id}/pay`)}
              >
                Thanh toán
              </Button>
              <Button
                type="link"
                danger
                icon={<StopOutlined />}
                onClick={() => handleCancel(record.id)}
              >
                Hủy
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý hóa đơn">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Tất cả" key="all" />
        <TabPane tab="Chưa thanh toán" key="CHUA_THANH_TOAN" />
        <TabPane tab="Đã thanh toán" key="DA_THANH_TOAN" />
        <TabPane tab="Đã hủy" key="DA_HUY" />
      </Tabs>
      <Table
        columns={columns}
        dataSource={invoices}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default InvoicesPage;
