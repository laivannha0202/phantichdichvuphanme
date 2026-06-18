import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Table, Tag, Button, Divider, message } from 'antd';
import { ArrowLeftOutlined, CreditCardOutlined } from '@ant-design/icons';
import { getInvoice } from '../api/invoices.api';
import type { Invoice, InvoiceStatus } from '../types/sprint4.types';
import dayjs from 'dayjs';

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

const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInvoice(parseInt(id));
    }
  }, [id]);

  const fetchInvoice = async (invoiceId: number) => {
    setLoading(true);
    try {
      const data = await getInvoice(invoiceId);
      setInvoice(data);
    } catch (error) {
      message.error('Không thể tải chi tiết hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  if (!invoice) {
    return null;
  }

  const itemColumns = [
    {
      title: 'STT',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Món',
      dataIndex: ['menu_item', 'name'],
      key: 'name',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (price: number) => `${price.toLocaleString('vi-VN')}đ`,
    },
    {
      title: 'Thành tiền',
      key: 'subtotal',
      render: (_: any, record: any) =>
        `${(record.unit_price * record.quantity).toLocaleString('vi-VN')}đ`,
    },
  ];

  return (
    <div>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/invoices')}
        style={{ marginBottom: 16 }}
      >
        Quay lại danh sách
      </Button>

      <Card title={`Hóa đơn ${invoice.invoice_code}`} loading={loading}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Mã hóa đơn">{invoice.invoice_code}</Descriptions.Item>
          <Descriptions.Item label="Đơn hàng">
            {invoice.order?.order_code}
          </Descriptions.Item>
          <Descriptions.Item label="Bàn">
            {invoice.order?.table?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={statusColors[invoice.status]}>
              {statusLabels[invoice.status]}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {dayjs(invoice.created_at).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">
            {invoice.notes || 'Không có'}
          </Descriptions.Item>
        </Descriptions>

        <Divider>Danh sách món</Divider>

        <Table
          columns={itemColumns}
          dataSource={invoice.order?.items || []}
          rowKey="id"
          pagination={false}
          size="small"
        />

        <Divider>Tính tiền</Divider>

        <Descriptions bordered column={2}>
          <Descriptions.Item label="Tạm tính">
            {invoice.subtotal.toLocaleString('vi-VN')}đ
          </Descriptions.Item>
          <Descriptions.Item label={`Thuế (${invoice.tax_rate}%)`}>
            {invoice.tax_amount.toLocaleString('vi-VN')}đ
          </Descriptions.Item>
          <Descriptions.Item label="Giảm giá">
            {invoice.discount.toLocaleString('vi-VN')}đ
          </Descriptions.Item>
          <Descriptions.Item label="Tổng cộng">
            <strong>{invoice.total.toLocaleString('vi-VN')}đ</strong>
          </Descriptions.Item>
        </Descriptions>

        <Divider>Lịch sử thanh toán</Divider>

        {invoice.payments && invoice.payments.length > 0 ? (
          <Table
            dataSource={invoice.payments}
            rowKey="id"
            pagination={false}
            size="small"
            columns={[
              {
                title: 'Phương thức',
                dataIndex: 'payment_method',
                key: 'payment_method',
              },
              {
                title: 'Số tiền',
                dataIndex: 'amount',
                key: 'amount',
                render: (amount: number) => `${amount.toLocaleString('vi-VN')}đ`,
              },
              {
                title: 'Mã GD',
                dataIndex: 'reference_no',
                key: 'reference_no',
              },
              {
                title: 'Thời gian',
                dataIndex: 'created_at',
                key: 'created_at',
                render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
              },
            ]}
          />
        ) : (
          <p>Chưa có thanh toán</p>
        )}

        {invoice.status === 'CHUA_THANH_TOAN' && (
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<CreditCardOutlined />}
              onClick={() => navigate(`/invoices/${invoice.id}/pay`)}
            >
              Thanh toán
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InvoiceDetailPage;
