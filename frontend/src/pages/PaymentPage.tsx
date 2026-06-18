import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Input, InputNumber, Radio, Button, Divider, Descriptions, message } from 'antd';
import { ArrowLeftOutlined, CreditCardOutlined } from '@ant-design/icons';
import { getInvoice, payInvoice } from '../api/invoices.api';
import type { Invoice, PayInvoiceRequest } from '../types/sprint4.types';

const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      form.setFieldsValue({
        payment_method: 'TIEN_MAT',
        amount: data.total,
      });
    } catch (error) {
      message.error('Không thể tải thông tin hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: PayInvoiceRequest) => {
    if (!invoice) return;

    setSubmitting(true);
    try {
      const result = await payInvoice(invoice.id, values);
      message.success('Thanh toán thành công');
      if (result.change > 0) {
        message.info(`Tiền thừa: ${result.change.toLocaleString('vi-VN')}đ`);
      }
      navigate(`/invoices/${invoice.id}`);
    } catch (error) {
      message.error('Không thể thanh toán');
    } finally {
      setSubmitting(false);
    }
  };

  const watchedPaymentMethod = Form.useWatch('payment_method', form);
  const watchedAmount = Form.useWatch('amount', form);

  const calculateChange = () => {
    if (!invoice || !watchedAmount) return 0;
    return Math.max(0, watchedAmount - invoice.total);
  };

  if (!invoice) {
    return null;
  }

  return (
    <div>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(`/invoices/${invoice.id}`)}
        style={{ marginBottom: 16 }}
      >
        Quay lại chi tiết hóa đơn
      </Button>

      <Card title="Thanh toán hóa đơn" loading={loading}>
        <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
          <Descriptions.Item label="Mã hóa đơn">
            {invoice.invoice_code}
          </Descriptions.Item>
          <Descriptions.Item label="Đơn hàng">
            {invoice.order?.order_code}
          </Descriptions.Item>
          <Descriptions.Item label="Bàn">
            {invoice.order?.table?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">
            <strong style={{ color: '#f5222d', fontSize: 18 }}>
              {invoice.total.toLocaleString('vi-VN')}đ
            </strong>
          </Descriptions.Item>
        </Descriptions>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="payment_method"
            label="Phương thức thanh toán"
            rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán' }]}
          >
            <Radio.Group>
              <Radio.Button value="TIEN_MAT">Tiền mặt</Radio.Button>
              <Radio.Button value="CHUYEN_KHOAN">Chuyển khoản</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="amount"
            label="Số tiền khách đưa"
            rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
          >
            <InputNumber
              min={invoice.total}
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => Number(value?.replace(/,/g, '') || 0) as any}
              addonAfter="VNĐ"
            />
          </Form.Item>

          {watchedPaymentMethod === 'CHUYEN_KHOAN' && (
            <Form.Item
              name="reference_no"
              label="Mã giao dịch"
              rules={[{ required: true, message: 'Vui lòng nhập mã giao dịch' }]}
            >
              <Input placeholder="Nhập mã giao dịch chuyển khoản" />
            </Form.Item>
          )}

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea placeholder="Ghi chú thanh toán (tùy chọn)" />
          </Form.Item>

          <Divider />

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

          {watchedPaymentMethod === 'TIEN_MAT' && watchedAmount > invoice.total && (
            <Descriptions bordered column={2} style={{ marginTop: 16 }}>
              <Descriptions.Item label="Tiền khách đưa">
                {watchedAmount?.toLocaleString('vi-VN')}đ
              </Descriptions.Item>
              <Descriptions.Item label="Tiền thừa">
                <strong style={{ color: '#52c41a' }}>
                  {calculateChange().toLocaleString('vi-VN')}đ
                </strong>
              </Descriptions.Item>
            </Descriptions>
          )}

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CreditCardOutlined />}
              loading={submitting}
              size="large"
            >
              Xác nhận thanh toán
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default PaymentPage;
