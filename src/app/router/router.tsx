import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  Outlet,
} from '@tanstack/react-router';
import { RootLayout } from '@/app/layouts/RootLayout';
import { PlaceholderPage } from '@/shared/components/PlaceholderPage';
import { LoadingState } from '@/shared/components/ui';

/**
 * Feature pages are lazily loaded so each route ships in its own chunk, keeping
 * the initial bundle small. The shell (layout) stays eager.
 */
const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => (
    <PlaceholderPage title="Page not found" description="The requested page does not exist." />
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazyRouteComponent(
    () => import('@/features/dashboard/components/DashboardPage'),
    'DashboardPage',
  ),
});

const salesOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'sales-orders',
  component: Outlet,
});

const salesOrdersIndexRoute = createRoute({
  getParentRoute: () => salesOrdersRoute,
  path: '/',
  component: lazyRouteComponent(
    () => import('@/features/sales-orders/components/SalesOrdersPage'),
    'SalesOrdersPage',
  ),
});

const salesOrderNewRoute = createRoute({
  getParentRoute: () => salesOrdersRoute,
  path: 'new',
  component: lazyRouteComponent(
    () => import('@/features/sales-orders/components/CreateSalesOrderPage'),
    'CreateSalesOrderPage',
  ),
});

const salesOrderDetailRoute = createRoute({
  getParentRoute: () => salesOrdersRoute,
  path: '$orderId',
  component: lazyRouteComponent(
    () => import('@/features/sales-orders/components/SalesOrderDetailPage'),
    'SalesOrderDetailPage',
  ),
});

const schedulingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'scheduling',
  component: lazyRouteComponent(
    () => import('@/features/scheduling/components/SchedulingPage'),
    'SchedulingPage',
  ),
});

const monitoringRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'monitoring',
  component: lazyRouteComponent(
    () => import('@/features/monitoring/components/MonitoringPage'),
    'MonitoringPage',
  ),
});

const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'customers',
  component: lazyRouteComponent(
    () => import('@/features/customers/components/CustomersPage'),
    'CustomersPage',
  ),
});

const transportTypesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'transport-types',
  component: lazyRouteComponent(
    () => import('@/features/transport-types/components/TransportTypesPage'),
    'TransportTypesPage',
  ),
});

const itemsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'items',
  component: lazyRouteComponent(() => import('@/features/items/components/ItemsPage'), 'ItemsPage'),
});

const auditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'audit',
  component: lazyRouteComponent(() => import('@/features/audit/components/AuditPage'), 'AuditPage'),
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
  defaultPendingComponent: () => <LoadingState />,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
