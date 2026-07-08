import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { RootLayout } from '@/app/layouts/RootLayout';
import { PlaceholderPage } from '@/shared/components/PlaceholderPage';
import { CustomersPage } from '@/features/customers/components/CustomersPage';
import { TransportTypesPage } from '@/features/transport-types/components/TransportTypesPage';
import { ItemsPage } from '@/features/items/components/ItemsPage';

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => (
    <PlaceholderPage title="Page not found" description="The requested page does not exist." />
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <PlaceholderPage title="Dashboard" description="Operational overview of sales orders." />
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
  component: () => (
    <PlaceholderPage title="Sales Orders" description="Create and track sales orders." />
  ),
});

const schedulingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'scheduling',
  component: () => <PlaceholderPage title="Scheduling" description="Manage delivery schedules." />,
});

const monitoringRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'monitoring',
  component: () => (
    <PlaceholderPage title="Monitoring" description="Filter and monitor operations." />
  ),
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
  component: () => (
    <PlaceholderPage title="Audit Trail" description="Traceability of relevant events." />
  ),
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  salesOrdersRoute.addChildren([salesOrdersIndexRoute]),
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
