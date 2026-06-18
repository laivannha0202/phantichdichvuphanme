import { Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TableAreasPage } from '../pages/TableAreasPage';
import { TablesPage } from '../pages/TablesPage';
import { MenuCategoriesPage } from '../pages/MenuCategoriesPage';
import { MenuItemsPage } from '../pages/MenuItemsPage';
import { OrdersPage } from '../pages/OrdersPage';
import { OrderDetailPage } from '../pages/OrderDetailPage';
import InvoicesPage from '../pages/InvoicesPage';
import InvoiceDetailPage from '../pages/InvoiceDetailPage';
import PaymentPage from '../pages/PaymentPage';
import { KitchenPage } from '../pages/KitchenPage';
import { ReservationsPage } from '../pages/ReservationsPage';
import { RevenueReportPage } from '../pages/RevenueReportPage';
import InventoryPage from '../pages/InventoryPage';
import StaffUsersPage from '../pages/StaffUsersPage';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { MainLayout } from '../layouts/MainLayout';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/table-areas" element={<TableAreasPage />} />
          <Route path="/tables" element={<TablesPage />} />
          <Route path="/menu/categories" element={<MenuCategoriesPage />} />
          <Route path="/menu/items" element={<MenuItemsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
          <Route path="/invoices/:id/pay" element={<PaymentPage />} />
          <Route path="/kitchen" element={<KitchenPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/reports/revenue" element={<RevenueReportPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/staff-users" element={<StaffUsersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
