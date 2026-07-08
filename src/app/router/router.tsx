import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { RootLayout } from '@/app/layouts/RootLayout';
import { PlaceholderPage } from '@/shared/components/PlaceholderPage';
import { CustomersPage } from '@/features/customers/components/CustomersPage';
import { TransportTypesPage } from '@/features/transport-types/components/TransportTypesPage';
import { ItemsPage } from '@/features/items/components/ItemsPage';
import { SalesOrdersPage } from '@/features/sales-orders/components/SalesOrdersPage';
import { CreateSalesOrderPage } from '@/features/sales-orders/components/CreateSalesOrderPage';
import { SalesOrderDetailPage } from '@/features/sales-orders/components/SalesOrderDetailPage';
import { SchedulingPage } from '@/features/scheduling/components/SchedulingPage';
import { MonitoringPage } from '@/features/monitoring/components/MonitoringPage';
import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { AuditPage } from '@/features/audit/components/AuditPage';

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => (
    <PlaceholderPage title="Page not found" description="The requested page does not exist." />
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const salesOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'sales-orders',
  component: Outlet,
});

const salesOrdersIndexRoute = createRoute({
  getParentRoute: () => salesOrdersRoute,
  path: '/',
  component: SalesOrdersPage,
});

const salesOrderNewRoute = createRoute({
  getParentRoute: () => salesOrdersRoute,
  path: 'new',
  component: CreateSalesOrderPage,
});

const salesOrderDetailRoute = createRoute({
  getParentRoute: () => salesOrdersRoute,
  path: '$orderId',
  component: SalesOrderDetailPage,
});

const schedulingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'scheduling',
  component: SchedulingPage,
});

const monitoringRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'monitoring',
  component: MonitoringPage,
});

const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'customers',
  component: CustomersPage,
});

const transportTypesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'transport-types',
  component: TransportTypesPage,
});

const itemsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'items',
  component: ItemsPage,
});

const auditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'audit',
  component: AuditPage,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  salesOrdersRoute.addChildren([salesOrdersIndexRoute, salesOrderNewRoute, salesOrderDetailRoute]),
  schedulingRoute,
  monitoringRoute,
  customersRoute,
  transportTypesRoute,
  itemsRoute,
  auditRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
