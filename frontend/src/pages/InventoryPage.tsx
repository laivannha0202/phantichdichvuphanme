import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Tag,
  message,
  Empty,
  Card,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  ReloadOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type {
  Supplier,
  Ingredient,
  InventoryTransaction,
  InventorySummary,
} from '../types/inventory.types';
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  getIngredients,
  createIngredient,
  updateIngredient,
  getTransactions,
  importStock,
  exportStock,
  getLowStock,
  getSummary,
} from '../api/inventory.api';

const { TabPane } = Tabs;

const InventoryPage: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState('ingredients');
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [lowStock, setLowStock] = useState<Ingredient[]>([]);
  const [summary, setSummary] = useState<InventorySummary | null>(null);
  
  // Modal states
  const [supplierModalVisible, setSupplierModalVisible] = useState(false);
  const [ingredientModalVisible, setIngredientModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  
  // Forms
  const [supplierForm] = Form.useForm();
  const [ingredientForm] = Form.useForm();
  const [importForm] = Form.useForm();
  const [exportForm] = Form.useForm();

  // ==================== LOAD DATA ====================

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      message.error('Không thể tải danh sách nhà cung cấp');
    } finally {
      setLoading(false);
    }
  };

  const loadIngredients = async () => {
    try {
      setLoading(true);
      const data = await getIngredients();
      setIngredients(data);
    } catch (error) {
      message.error('Không thể tải danh sách nguyên liệu');
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      message.error('Không thể tải lịch sử giao dịch');
    } finally {
      setLoading(false);
    }
  };

  const loadLowStock = async () => {
    try {
      setLoading(true);
      const data = await getLowStock();
      setLowStock(data);
    } catch (error) {
      message.error('Không thể tải danh sách cảnh báo');
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const data = await getSummary();
      setSummary(data);
    } catch (error) {
      message.error('Không thể tải tổng quan kho');
    }
  };

  const loadAll = () => {
    loadSuppliers();
    loadIngredients();
    loadTransactions();
    loadLowStock();
    loadSummary();
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ==================== SUPPLIER HANDLERS ====================

  const handleCreateSupplier = () => {
    setEditingSupplier(null);
    supplierForm.resetFields();
    setSupplierModalVisible(true);
  };

  const handleEditSupplier = (record: Supplier) => {
    setEditingSupplier(record);
    supplierForm.setFieldsValue(record);
    setSupplierModalVisible(true);
  };

  const handleSupplierSubmit = async () => {
    try {
      const values = await supplierForm.validateFields();
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, values);
        message.success('Cập nhật nhà cung cấp thành công');
      } else {
        await createSupplier(values);
        message.success('Tạo nhà cung cấp thành công');
      }
      setSupplierModalVisible(false);
      loadSuppliers();
    } catch (error) {
      message.error('Thao tác thất bại');
    }
  };

  // ==================== INGREDIENT HANDLERS ====================

  const handleCreateIngredient = () => {
    setEditingIngredient(null);
    ingredientForm.resetFields();
    setIngredientModalVisible(true);
  };

  const handleEditIngredient = (record: Ingredient) => {
    setEditingIngredient(record);
    ingredientForm.setFieldsValue(record);
    setIngredientModalVisible(true);
  };

  const handleIngredientSubmit = async () => {
    try {
      const values = await ingredientForm.validateFields();
      if (editingIngredient) {
        await updateIngredient(editingIngredient.id, values);
        message.success('Cập nhật nguyên liệu thành công');
      } else {
        await createIngredient(values);
        message.success('Tạo nguyên liệu thành công');
      }
      setIngredientModalVisible(false);
      loadIngredients();
      loadSummary();
    } catch (error) {
      message.error('Thao tác thất bại');
    }
  };

  // ==================== TRANSACTION HANDLERS ====================

  const handleImport = async () => {
    try {
      const values = await importForm.validateFields();
      await importStock(values);
      message.success('Nhập kho thành công');
      setImportModalVisible(false);
      importForm.resetFields();
      loadIngredients();
      loadTransactions();
      loadSummary();
      loadLowStock();
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Nhập kho thất bại');
      }
    }
  };

  const handleExport = async () => {
    try {
      const values = await exportForm.validateFields();
      await exportStock(values);
      message.success('Xuất kho thành công');
      setExportModalVisible(false);
      exportForm.resetFields();
      loadIngredients();
      loadTransactions();
      loadSummary();
      loadLowStock();
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Xuất kho thất bại');
      }
    }
  };

  // ==================== COLUMNS ====================

  const supplierColumns: ColumnsType<Supplier> = [
    { title: 'Mã', dataIndex: 'supplierCode', key: 'supplierCode' },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address', ellipsis: true },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'DANG_HOP_TAC' ? 'green' : 'red'}>
          {status === 'DANG_HOP_TAC' ? 'Đang hợp tác' : 'Ngừng hợp tác'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => handleEditSupplier(record)}>
          Sửa
        </Button>
      ),
    },
  ];

  const ingredientColumns: ColumnsType<Ingredient> = [
    { title: 'Mã', dataIndex: 'ingredientCode', key: 'ingredientCode' },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Đơn vị', dataIndex: 'unit', key: 'unit' },
    {
      title: 'Tồn kho',
      dataIndex: 'currentStock',
      key: 'currentStock',
      render: (value: number) => value.toLocaleString('vi-VN'),
    },
    {
      title: 'Tồn tối thiểu',
      dataIndex: 'minStock',
      key: 'minStock',
      render: (value: number) => value.toLocaleString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          CON_HANG: 'green',
          SAP_HET: 'orange',
          HET_HANG: 'red',
          NGUNG_SU_DUNG: 'default',
        };
        const labelMap: Record<string, string> = {
          CON_HANG: 'Còn hàng',
          SAP_HET: 'Sắp hết',
          HET_HANG: 'Hết hàng',
          NGUNG_SU_DUNG: 'Ngừng sử dụng',
        };
        return <Tag color={colorMap[status]}>{labelMap[status]}</Tag>;
      },
    },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note', ellipsis: true },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => handleEditIngredient(record)}>
          Sửa
        </Button>
      ),
    },
  ];

  const transactionColumns: ColumnsType<InventoryTransaction> = [
    { title: 'Mã GD', dataIndex: 'transactionCode', key: 'transactionCode' },
    {
      title: 'Nguyên liệu',
      key: 'ingredient',
      render: (_, record) => record.ingredient?.name || '-',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          NHAP_KHO: 'green',
          XUAT_KHO: 'red',
          DIEU_CHINH: 'blue',
        };
        const labelMap: Record<string, string> = {
          NHAP_KHO: 'Nhập kho',
          XUAT_KHO: 'Xuất kho',
          DIEU_CHINH: 'Điều chỉnh',
        };
        return <Tag color={colorMap[type]}>{labelMap[type]}</Tag>;
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value: number) => value.toLocaleString('vi-VN'),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (value: number) => value ? `${value.toLocaleString('vi-VN')}đ` : '-',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value: number) => value ? `${value.toLocaleString('vi-VN')}đ` : '-',
    },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note', ellipsis: true },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => new Date(value).toLocaleString('vi-VN'),
    },
  ];

  const lowStockColumns: ColumnsType<Ingredient> = [
    { title: 'Mã', dataIndex: 'ingredientCode', key: 'ingredientCode' },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Đơn vị', dataIndex: 'unit', key: 'unit' },
    {
      title: 'Tồn kho',
      dataIndex: 'currentStock',
      key: 'currentStock',
      render: (value: number) => (
        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
          {value.toLocaleString('vi-VN')}
        </span>
      ),
    },
    {
      title: 'Tồn tối thiểu',
      dataIndex: 'minStock',
      key: 'minStock',
      render: (value: number) => value.toLocaleString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'HET_HANG' ? 'red' : 'orange'}>
          {status === 'HET_HANG' ? 'Hết hàng' : 'Sắp hết'}
        </Tag>
      ),
    },
  ];

  // ==================== RENDER ====================

  return (
    <div style={{ padding: '24px' }}>
      {/* Summary Cards */}
      {summary && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic title="Tổng nguyên liệu" value={summary.totalIngredients} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Cảnh báo sắp hết"
                value={summary.lowStockCount}
                valueStyle={{ color: summary.lowStockCount > 0 ? '#ff4d4f' : '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic title="Tổng giao dịch" value={summary.totalTransactions} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Giá trị tồn kho"
                value={summary.totalStockValue}
                suffix="đ"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Nguyên liệu" key="ingredients">
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateIngredient}>
                Thêm nguyên liệu
              </Button>
              <Button icon={<ReloadOutlined />} onClick={loadIngredients}>
                Tải lại
              </Button>
            </Space>
          </div>
          <Table
            columns={ingredientColumns}
            dataSource={ingredients}
            rowKey="id"
            loading={loading}
          />
        </TabPane>

        <TabPane tab="Nhà cung cấp" key="suppliers">
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateSupplier}>
                Thêm nhà cung cấp
              </Button>
              <Button icon={<ReloadOutlined />} onClick={loadSuppliers}>
                Tải lại
              </Button>
            </Space>
          </div>
          <Table
            columns={supplierColumns}
            dataSource={suppliers}
            rowKey="id"
            loading={loading}
          />
        </TabPane>

        <TabPane tab="Nhập kho" key="import">
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setImportModalVisible(true)}>
                Nhập kho
              </Button>
              <Button icon={<ReloadOutlined />} onClick={loadTransactions}>
                Tải lại
              </Button>
            </Space>
          </div>
          <Table
            columns={transactionColumns.filter((col) => col.key !== 'actions')}
            dataSource={transactions.filter((t) => t.type === 'NHAP_KHO')}
            rowKey="id"
            loading={loading}
          />
        </TabPane>

        <TabPane tab="Xuất kho" key="export">
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button type="primary" danger icon={<PlusOutlined />} onClick={() => setExportModalVisible(true)}>
                Xuất kho
              </Button>
              <Button icon={<ReloadOutlined />} onClick={loadTransactions}>
                Tải lại
              </Button>
            </Space>
          </div>
          <Table
            columns={transactionColumns.filter((col) => col.key !== 'actions')}
            dataSource={transactions.filter((t) => t.type === 'XUAT_KHO')}
            rowKey="id"
            loading={loading}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <WarningOutlined />
              Cảnh báo sắp hết ({lowStock.length})
            </span>
          }
          key="lowstock"
        >
          <Table
            columns={lowStockColumns}
            dataSource={lowStock}
            rowKey="id"
            loading={loading}
            locale={{ emptyText: <Empty description="Không có nguyên liệu sắp hết" /> }}
          />
        </TabPane>
      </Tabs>

      {/* Supplier Modal */}
      <Modal
        title={editingSupplier ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'}
        open={supplierModalVisible}
        onOk={handleSupplierSubmit}
        onCancel={() => setSupplierModalVisible(false)}
      >
        <Form form={supplierForm} layout="vertical">
          {!editingSupplier && (
            <Form.Item
              name="supplierCode"
              label="Mã nhà cung cấp"
              rules={[{ required: true, message: 'Vui lòng nhập mã nhà cung cấp' }]}
            >
              <Input />
            </Form.Item>
          )}
          <Form.Item
            name="name"
            label="Tên nhà cung cấp"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      {/* Ingredient Modal */}
      <Modal
        title={editingIngredient ? 'Sửa nguyên liệu' : 'Thêm nguyên liệu'}
        open={ingredientModalVisible}
        onOk={handleIngredientSubmit}
        onCancel={() => setIngredientModalVisible(false)}
      >
        <Form form={ingredientForm} layout="vertical">
          {!editingIngredient && (
            <Form.Item
              name="ingredientCode"
              label="Mã nguyên liệu"
              rules={[{ required: true, message: 'Vui lòng nhập mã nguyên liệu' }]}
            >
              <Input />
            </Form.Item>
          )}
          <Form.Item
            name="name"
            label="Tên nguyên liệu"
            rules={[{ required: true, message: 'Vui lòng nhập tên nguyên liệu' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="unit"
            label="Đơn vị tính"
            rules={[{ required: true, message: 'Vui lòng nhập đơn vị tính' }]}
          >
            <Input />
          </Form.Item>
          {!editingIngredient && (
            <Form.Item name="currentStock" label="Tồn kho hiện tại">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          )}
          <Form.Item name="minStock" label="Tồn kho tối thiểu">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      {/* Import Modal */}
      <Modal
        title="Nhập kho"
        open={importModalVisible}
        onOk={handleImport}
        onCancel={() => setImportModalVisible(false)}
      >
        <Form form={importForm} layout="vertical">
          <Form.Item
            name="ingredientId"
            label="Nguyên liệu"
            rules={[{ required: true, message: 'Vui lòng chọn nguyên liệu' }]}
          >
            <Select placeholder="Chọn nguyên liệu">
              {ingredients.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name} ({item.unit})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="supplierId" label="Nhà cung cấp">
            <Select placeholder="Chọn nhà cung cấp (tùy chọn)" allowClear>
              {suppliers
                .filter((s) => s.status === 'DANG_HOP_TAC')
                .map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
          >
            <InputNumber min={0.001} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="unitPrice" label="Đơn giá">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      {/* Export Modal */}
      <Modal
        title="Xuất kho"
        open={exportModalVisible}
        onOk={handleExport}
        onCancel={() => setExportModalVisible(false)}
      >
        <Form form={exportForm} layout="vertical">
          <Form.Item
            name="ingredientId"
            label="Nguyên liệu"
            rules={[{ required: true, message: 'Vui lòng chọn nguyên liệu' }]}
          >
            <Select placeholder="Chọn nguyên liệu">
              {ingredients
                .filter((item) => item.currentStock > 0)
                .map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name} (Tồn: {item.currentStock.toLocaleString('vi-VN')} {item.unit})
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
          >
            <InputNumber min={0.001} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryPage;