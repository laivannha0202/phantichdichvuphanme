import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Card,
  Tag,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Typography,
  Button,
  Modal,
  Descriptions,
  Tooltip,
  Empty,
  Spin,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { getAuditLogs, getAuditLog } from '../api/audit-logs.api';
import type {
  AuditLogRecord,
  AuditLogQueryParams,
} from '../types/auditLog.types';
import {
  AUDIT_ACTION_LABELS,
  AUDIT_MODULE_LABELS,
  AUDIT_ACTION_COLORS,
} from '../types/auditLog.types';

const { Title } = Typography;
const { RangePicker } = DatePicker;

// Options cho combobox
const ACTION_OPTIONS = Object.entries(AUDIT_ACTION_LABELS).map(
  ([value, label]) => ({ value, label }),
);
const MODULE_OPTIONS = Object.entries(AUDIT_MODULE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [filters, setFilters] = useState<AuditLogQueryParams>({
    page: 1,
    limit: 20,
    sort: 'desc',
  });
  const [searchText, setSearchText] = useState('');
  const [detailModal, setDetailModal] = useState({
    open: false,
    loading: false,
    record: null as AuditLogRecord | null,
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAuditLogs(filters);
      setLogs(response.data);
      setPagination((prev) => ({
        ...prev,
        current: response.pagination.page,
        pageSize: response.pagination.limit,
        total: response.pagination.total,
      }));
    } catch {
      // Error handled by axios interceptor
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Xem chi tiết
  const handleViewDetail = async (id: number) => {
    setDetailModal({ open: true, loading: true, record: null });
    try {
      const response = await getAuditLog(id);
      setDetailModal({ open: true, loading: false, record: response.data });
    } catch {
      setDetailModal({ open: true, loading: false, record: null });
    }
  };

  // Đổi trang
  const handleTableChange = (pag: { current: number; pageSize: number }) => {
    const newFilters = {
      ...filters,
      page: pag.current,
      limit: pag.pageSize,
    };
    setFilters(newFilters);
  };

  // Search username
  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      username: searchText || undefined,
      page: 1,
    }));
  };

  // Columns
  const columns: ColumnsType<AuditLogRecord> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (val: string) => dayjs(val).format('DD/MM/YYYY HH:mm:ss'),
      sorter: (a, b) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Người dùng',
      dataIndex: 'username',
      key: 'username',
      width: 120,
      render: (val: string | null) => val ?? '—',
    },
    {
      title: 'Vai trò',
      dataIndex: 'roleCode',
      key: 'roleCode',
      width: 130,
      render: (val: string | null) =>
        val ? <Tag>{val}</Tag> : <Tag>—</Tag>,
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      width: 160,
      render: (action: string) => (
        <Tag color={AUDIT_ACTION_COLORS[action] || 'default'}>
          {AUDIT_ACTION_LABELS[action] || action}
        </Tag>
      ),
    },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
      width: 100,
      render: (mod: string) => AUDIT_MODULE_LABELS[mod] || mod,
    },
    {
      title: 'Đối tượng',
      key: 'entity',
      width: 130,
      render: (_: unknown, record: AuditLogRecord) => {
        if (!record.entityType) return '—';
        return `${record.entityType}${record.entityId ? ` #${record.entityId}` : ''}`;
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (val: string | null) => val ?? '—',
    },
    {
      title: 'IP',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 120,
      render: (val: string | null) => val ?? '—',
    },
    {
      title: 'Thao tác',
      key: 'actionCol',
      width: 80,
      fixed: 'right',
      render: (_: unknown, record: AuditLogRecord) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.id)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            Nhật ký hoạt động
          </Title>
        </Col>
        <Col>
          <Button icon={<ReloadOutlined />} onClick={fetchLogs}>
            Làm mới
          </Button>
        </Col>
      </Row>

      {/* Bộ lọc */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm theo username..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="Hành động"
              allowClear
              style={{ width: '100%' }}
              options={ACTION_OPTIONS}
              value={filters.action}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, action: val, page: 1 }))
              }
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="Module"
              allowClear
              style={{ width: '100%' }}
              options={MODULE_OPTIONS}
              value={filters.module}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, module: val, page: 1 }))
              }
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={(dates) => {
                setFilters((prev) => ({
                  ...prev,
                  from_date: dates?.[0]?.toISOString(),
                  to_date: dates?.[1]?.toISOString(),
                  page: 1,
                }));
              }}
            />
          </Col>
        </Row>
      </Card>

      {/* Bảng */}
      <Table<AuditLogRecord>
        columns={columns}
        dataSource={logs}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / ${total} bản ghi`,
        }}
        onChange={handleTableChange as any}
        scroll={{ x: 1200 }}
        size="middle"
        locale={{
          emptyText: <Empty description="Không có nhật ký hoạt động" />,
        }}
      />

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết nhật ký hoạt động"
        open={detailModal.open}
        onCancel={() => setDetailModal({ open: false, loading: false, record: null })}
        footer={null}
        width={640}
      >
        {detailModal.loading ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <Spin />
          </div>
        ) : detailModal.record ? (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="ID">
              {detailModal.record.id}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian">
              {dayjs(detailModal.record.createdAt).format(
                'DD/MM/YYYY HH:mm:ss',
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Người dùng">
              {detailModal.record.username ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              {detailModal.record.roleCode ? (
                <Tag>{detailModal.record.roleCode}</Tag>
              ) : (
                '—'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Hành động" span={2}>
              <Tag
                color={
                  AUDIT_ACTION_COLORS[detailModal.record.action] || 'default'
                }
              >
                {AUDIT_ACTION_LABELS[detailModal.record.action] ||
                  detailModal.record.action}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Module">
              {AUDIT_MODULE_LABELS[detailModal.record.module] ||
                detailModal.record.module}
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức">
              {detailModal.record.method ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Đường dẫn" span={2}>
              <Typography.Text copyable ellipsis>
                {detailModal.record.path ?? '—'}
              </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Mã trạng thái">
              {detailModal.record.statusCode ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Đối tượng">
              {detailModal.record.entityType
                ? `${detailModal.record.entityType}${detailModal.record.entityId ? ` #${detailModal.record.entityId}` : ''}`
                : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả" span={2}>
              {detailModal.record.description ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="IP">
              {detailModal.record.ipAddress ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="User Agent" span={2}>
              <Typography.Text
                ellipsis={{ tooltip: detailModal.record.userAgent ?? undefined }}
              >
                {detailModal.record.userAgent ?? '—'}
              </Typography.Text>
            </Descriptions.Item>
            {detailModal.record.metadata && (
              <Descriptions.Item label="Metadata" span={2}>
                <pre
                  style={{
                    fontSize: 12,
                    maxHeight: 200,
                    overflow: 'auto',
                    background: '#f5f5f5',
                    padding: 8,
                    borderRadius: 4,
                  }}
                >
                  {JSON.stringify(detailModal.record.metadata, null, 2)}
                </pre>
              </Descriptions.Item>
            )}
          </Descriptions>
        ) : (
          <Empty description="Không tìm thấy dữ liệu" />
        )}
      </Modal>
    </div>
  );
}
