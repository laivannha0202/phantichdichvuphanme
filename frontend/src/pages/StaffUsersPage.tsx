import React, { useState, useEffect, useMemo } from 'react';
import {
  Tabs,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  message,
  Empty,
  Popconfirm,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  ReloadOutlined,
  LockOutlined,
  UnlockOutlined,
  KeyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../auth/useAuth';
import type {
  StaffRecord,
  UserRecord,
  RoleRecord,
} from '../types/staffUsers.types';
import {
  getStaffList,
  createStaff,
  updateStaff,
  updateStaffStatus,
  deleteStaff,
} from '../api/staff.api';
import {
  getUsersList,
  createUser,
  updateUser,
  updateUserStatus,
  resetUserPassword,
  deleteUser,
} from '../api/users.api';
import { getRoles } from '../api/role.api';

const { TabPane } = Tabs;
const { Text } = Typography;

type StaffFormData = {
  full_name: string;
  phone?: string;
  position?: string;
  username: string;
  password: string;
  role_id: number;
};

type UserFormData = {
  username: string;
  password?: string;
  role_id: number;
  status?: string;
};

const StaffUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const roleCode = currentUser?.role?.code;

  const canEditAdmin = roleCode === 'QUAN_TRI_HE_THONG';
  const canManage = roleCode === 'QUAN_TRI_HE_THONG' || roleCode === 'QUAN_LY';

  // State
  const [activeTab, setActiveTab] = useState('staff');
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState<StaffRecord[]>([]);
  const [usersList, setUsersList] = useState<UserRecord[]>([]);
  const [roles, setRoles] = useState<RoleRecord[]>([]);

  // Staff modal
  const [staffModalVisible, setStaffModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffRecord | null>(null);
  const [staffForm] = Form.useForm();

  // User modal
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [userForm] = Form.useForm();

  // Password reset modal
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [resetUserId, setResetUserId] = useState<number | null>(null);
  const [resetPasswordForm] = Form.useForm();

  // ==================== LOAD DATA ====================

  const loadStaff = async () => {
    if (!canManage) return;
    try {
      setLoading(true);
      const data = await getStaffList();
      setStaffList(data);
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Không thể tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    if (!canManage) return;
    try {
      setLoading(true);
      const data = await getUsersList();
      setUsersList(data);
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Không thể tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch {
      // ignore
    }
  };

  const loadAll = () => {
    loadStaff();
    loadUsers();
    loadRoles();
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ==================== STAFF HANDLERS ====================

  const handleCreateStaff = () => {
    setEditingStaff(null);
    staffForm.resetFields();
    setStaffModalVisible(true);
  };

  const handleEditStaff = (record: StaffRecord) => {
    setEditingStaff(record);
    staffForm.setFieldsValue({
      full_name: record.fullName,
      phone: record.phone,
      position: record.position,
      username: record.user?.username || '',
      role_id: undefined, // not editable for now
    });
    setStaffModalVisible(true);
  };

  const handleStaffSubmit = async () => {
    try {
      const values: StaffFormData = await staffForm.validateFields();
      if (editingStaff) {
        await updateStaff(editingStaff.id, {
          full_name: values.full_name,
          phone: values.phone,
          position: values.position,
        });
        message.success('Cập nhật nhân viên thành công');
      } else {
        await createStaff({
          full_name: values.full_name,
          phone: values.phone,
          position: values.position,
          user: {
            username: values.username,
            password: values.password,
            role_id: values.role_id,
          },
        });
        message.success('Tạo nhân viên thành công');
      }
      setStaffModalVisible(false);
      loadStaff();
      loadUsers();
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Thao tác thất bại');
      }
    }
  };

  const handleStaffStatusChange = async (id: number, status: string) => {
    try {
      await updateStaffStatus(id, status);
      message.success('Cập nhật trạng thái thành công');
      loadStaff();
      loadUsers();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleDeleteStaff = async (id: number) => {
    try {
      await deleteStaff(id);
      message.success('Đã xóa nhân viên');
      loadStaff();
      loadUsers();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Xóa thất bại');
    }
  };

  // ==================== USER HANDLERS ====================

  const handleCreateUser = () => {
    setEditingUser(null);
    userForm.resetFields();
    setUserModalVisible(true);
  };

  const handleEditUser = (record: UserRecord) => {
    setEditingUser(record);
    userForm.setFieldsValue({
      username: record.username,
      role_id: undefined,
    });
    setUserModalVisible(true);
  };

  const handleUserSubmit = async () => {
    try {
      const values: UserFormData = await userForm.validateFields();
      if (editingUser) {
        const updateData: Record<string, any> = { username: values.username };
        if (values.role_id) updateData.role_id = values.role_id;
        if (values.password) updateData.password = values.password;
        await updateUser(editingUser.id, updateData);
        message.success('Cập nhật tài khoản thành công');
      } else {
        await createUser({
          username: values.username,
          password: values.password!,
          role_id: values.role_id,
        });
        message.success('Tạo tài khoản thành công');
      }
      setUserModalVisible(false);
      loadUsers();
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Thao tác thất bại');
      }
    }
  };

  const handleUserStatusChange = async (id: number, status: string) => {
    try {
      await updateUserStatus(id, status);
      message.success('Cập nhật trạng thái thành công');
      loadUsers();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleResetPassword = async () => {
    try {
      const values = await resetPasswordForm.validateFields();
      if (resetUserId) {
        await resetUserPassword(resetUserId, values.new_password);
        message.success('Đặt lại mật khẩu thành công');
        setPasswordModalVisible(false);
        resetPasswordForm.resetFields();
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Đặt lại mật khẩu thất bại');
      }
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      message.success('Đã xóa tài khoản');
      loadUsers();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Xóa thất bại');
    }
  };

  // ==================== COLUMNS ====================

  const statusColorMap: Record<string, string> = {
    DANG_LAM: 'green',
    NGHI_VIEC: 'red',
    TAM_NGHI: 'orange',
    ACTIVE: 'green',
    INACTIVE: 'red',
  };

  const statusLabelMap: Record<string, string> = {
    DANG_LAM: 'Đang làm',
    NGHI_VIEC: 'Nghỉ việc',
    TAM_NGHI: 'Tạm nghỉ',
    ACTIVE: 'Hoạt động',
    INACTIVE: 'Vô hiệu hóa',
  };

  const staffColumns: ColumnsType<StaffRecord> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone', render: (v: string) => v || '-' },
    { title: 'Chức vụ', dataIndex: 'position', key: 'position', render: (v: string) => v || '-' },
    {
      title: 'Tài khoản',
      key: 'username',
      render: (_, record) => record.user?.username || '-',
    },
    {
      title: 'Vai trò',
      key: 'role',
      render: (_, record) => record.user?.role?.name || '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColorMap[status] || 'default'}>
          {statusLabelMap[status] || status}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="small" wrap>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditStaff(record)}
          >
            Sửa
          </Button>
          {record.status !== 'NGHI_VIEC' ? (
            <Button
              type="link"
              size="small"
              danger
              icon={<LockOutlined />}
              onClick={() => handleStaffStatusChange(record.id, 'NGHI_VIEC')}
            >
              Nghỉ việc
            </Button>
          ) : (
            <Button
              type="link"
              size="small"
              icon={<UnlockOutlined />}
              onClick={() => handleStaffStatusChange(record.id, 'DANG_LAM')}
            >
              Kích hoạt
            </Button>
          )}
          {canEditAdmin && (
            <Popconfirm
              title="Xóa nhân viên?"
              description="Thao tác này sẽ xóa nhân viên và tài khoản liên quan"
              onConfirm={() => handleDeleteStaff(record.id)}
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const userColumns: ColumnsType<UserRecord> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Tên đăng nhập', dataIndex: 'username', key: 'username' },
    {
      title: 'Vai trò',
      key: 'role',
      render: (_, record) => record.role?.name || '-',
    },
    {
      title: 'Nhân viên',
      key: 'staff',
      render: (_, record) => record.staff?.fullName || '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColorMap[status] || 'default'}>
          {statusLabelMap[status] || status}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => new Date(v).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="small" wrap>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            size="small"
            icon={<KeyOutlined />}
            onClick={() => {
              setResetUserId(record.id);
              resetPasswordForm.resetFields();
              setPasswordModalVisible(true);
            }}
          >
            Mật khẩu
          </Button>
          {record.status !== 'INACTIVE' ? (
            <Button
              type="link"
              size="small"
              danger
              icon={<LockOutlined />}
              onClick={() => handleUserStatusChange(record.id, 'INACTIVE')}
            >
              Khóa
            </Button>
          ) : (
            <Button
              type="link"
              size="small"
              icon={<UnlockOutlined />}
              onClick={() => handleUserStatusChange(record.id, 'ACTIVE')}
            >
              Kích hoạt
            </Button>
          )}
          {canEditAdmin && (
            <Popconfirm
              title="Xóa tài khoản?"
              description="Thao tác này không thể hoàn tác"
              onConfirm={() => handleDeleteUser(record.id)}
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const roleColumns: ColumnsType<RoleRecord> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Mã', dataIndex: 'code', key: 'code' },
    { title: 'Tên vai trò', dataIndex: 'name', key: 'name' },
  ];

  // Filter out QUAN_TRI_HE_THONG for QUAN_LY users
  const availableRoles = useMemo(() => {
    if (roleCode === 'QUAN_TRI_HE_THONG') return roles;
    return roles.filter((r) => r.code !== 'QUAN_TRI_HE_THONG');
  }, [roles, roleCode]);

  // ==================== RENDER ====================

  if (!canManage) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Empty description="Bạn không có quyền truy cập trang này" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* ============ STAFF TAB ============ */}
        <TabPane tab="Nhân viên" key="staff">
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateStaff}>
                Thêm nhân viên
              </Button>
              <Button icon={<ReloadOutlined />} onClick={loadStaff}>
                Tải lại
              </Button>
            </Space>
          </div>
          <Table
            columns={staffColumns}
            dataSource={staffList}
            rowKey="id"
            loading={loading}
            locale={{ emptyText: <Empty description="Chưa có nhân viên nào" /> }}
          />
        </TabPane>

        {/* ============ USERS TAB ============ */}
        <TabPane tab="Tài khoản" key="users">
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateUser}>
                Thêm tài khoản
              </Button>
              <Button icon={<ReloadOutlined />} onClick={loadUsers}>
                Tải lại
              </Button>
            </Space>
          </div>
          <Table
            columns={userColumns}
            dataSource={usersList}
            rowKey="id"
            loading={loading}
            locale={{ emptyText: <Empty description="Chưa có tài khoản nào" /> }}
          />
        </TabPane>

        {/* ============ ROLES TAB ============ */}
        <TabPane tab="Vai trò" key="roles">
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={loadRoles}>
                Tải lại
              </Button>
            </Space>
          </div>
          <Table
            columns={roleColumns}
            dataSource={roles}
            rowKey="id"
            loading={loading}
            locale={{ emptyText: <Empty description="Chưa có vai trò nào" /> }}
          />
        </TabPane>
      </Tabs>

      {/* ==================== STAFF MODAL ==================== */}
      <Modal
        title={editingStaff ? 'Sửa nhân viên' : 'Thêm nhân viên'}
        open={staffModalVisible}
        onOk={handleStaffSubmit}
        onCancel={() => setStaffModalVisible(false)}
        width={560}
        destroyOnClose
      >
        <Form form={staffForm} layout="vertical">
          <Form.Item
            name="full_name"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="position" label="Chức vụ">
            <Input />
          </Form.Item>
          {!editingStaff && (
            <>
              <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                Thông tin tài khoản đăng nhập
              </Text>
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu' },
                  { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="role_id"
                label="Vai trò"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
              >
                <Select placeholder="Chọn vai trò">
                  {availableRoles.map((r) => (
                    <Select.Option key={r.id} value={r.id}>
                      {r.name} ({r.code})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      {/* ==================== USER MODAL ==================== */}
      <Modal
        title={editingUser ? 'Sửa tài khoản' : 'Thêm tài khoản'}
        open={userModalVisible}
        onOk={handleUserSubmit}
        onCancel={() => setUserModalVisible(false)}
        width={480}
        destroyOnClose
      >
        <Form form={userForm} layout="vertical">
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role_id"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select placeholder="Chọn vai trò">
              {availableRoles.map((r) => (
                <Select.Option key={r.id} value={r.id}>
                  {r.name} ({r.code})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {editingUser && (
            <Form.Item name="password" label="Mật khẩu mới (để trống nếu không đổi)">
              <Input.Password />
            </Form.Item>
          )}
          {!editingUser && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* ==================== RESET PASSWORD MODAL ==================== */}
      <Modal
        title="Đặt lại mật khẩu"
        open={passwordModalVisible}
        onOk={handleResetPassword}
        onCancel={() => setPasswordModalVisible(false)}
        width={400}
        destroyOnClose
      >
        <Form form={resetPasswordForm} layout="vertical">
          <Form.Item
            name="new_password"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffUsersPage;
