import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Result } from 'antd';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — Bắt lỗi render React.
 * Hiển thị màn hình lỗi thân thiện thay vì crash toàn bộ app.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Chỉ log trong dev, không gửi token/password ra ngoài
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            padding: '24px',
          }}
        >
          <Result
            status="error"
            title="Có lỗi xảy ra"
            subTitle="Ứng dụng gặp sự cố. Vui lòng tải lại trang để tiếp tục."
            extra={[
              <Button key="reload" type="primary" onClick={this.handleReload}>
                Tải lại trang
              </Button>,
              <Button key="reset" onClick={this.handleReset}>
                Thử lại
              </Button>,
            ]}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
