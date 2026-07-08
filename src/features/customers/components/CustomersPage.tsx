import { useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { PageHeader } from '@/shared/components/PageHeader';
import {
  Badge,
  Button,
  Card,
  DataTable,
  EmptyState,
  ErrorState,
  LoadingState,
  Modal,
  type Column,
} from '@/shared/components/ui';
import { formatDocument } from '@/shared/utils/format';
import { getErrorMessage } from '@/shared/lib/errors';
import type { Customer } from '@/shared/types';
import { useTransportTypes } from '@/features/transport-types/queries';
import { useCustomers, useCreateCustomer, useUpdateCustomer } from '../queries';
import type { CustomerFormValues } from '../schema';
import { CustomerForm } from './CustomerForm';

const FORM_ID = 'customer-form';

const emptyValues: CustomerFormValues = {
  name: '',
  document: '',
  email: '',
  active: true,
  authorizedTransportTypeIds: [],
};

export function CustomersPage() {
  const customersQuery = useCustomers();
  const transportTypesQuery = useTransportTypes();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const [editing, setEditing] = useState<Customer | null>(null);
  const [open, setOpen] = useState(false);

  const activeTransportTypes = (transportTypesQuery.data ?? []).filter((t) => t.active);
  const isSaving = createCustomer.isPending || updateCustomer.isPending;

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(customer: Customer) {
    setEditing(customer);
    setOpen(true);
  }

  function handleSubmit(values: CustomerFormValues) {
    const options = { onSuccess: () => setOpen(false) };
    if (editing) {
      updateCustomer.mutate({ id: editing.id, payload: values }, options);
    } else {
      createCustomer.mutate(values, options);
    }
  }

  const columns: Column<Customer>[] = [
    { header: 'Name', cell: (c) => <span className="font-medium text-slate-900">{c.name}</span> },
    { header: 'Document', cell: (c) => formatDocument(c.document) },
    { header: 'Email', cell: (c) => c.email },
    {
      header: 'Authorized transport',
      cell: (c) => <Badge>{c.authorizedTransportTypeIds.length} types</Badge>,
    },
    {
      header: 'Status',
      cell: (c) =>
        c.active ? (
          <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
        ) : (
          <Badge className="bg-slate-100 text-slate-500">Inactive</Badge>
        ),
    },
    {
      header: '',
      align: 'right',
      cell: (c) => (
        <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
          <Pencil className="size-4" />
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Manage customers and their authorized transport types."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            New customer
          </Button>
        }
      />

      <Card>
        {customersQuery.isPending ? (
          <LoadingState label="Loading customers..." />
        ) : customersQuery.isError ? (
          <ErrorState message={getErrorMessage(customersQuery.error)} />
        ) : customersQuery.data.length === 0 ? (
          <EmptyState
            message="No customers registered yet."
            action={
              <Button onClick={openCreate}>
                <Plus className="size-4" />
                New customer
              </Button>
            }
          />
        ) : (
          <DataTable columns={columns} rows={customersQuery.data} rowKey={(c) => c.id} />
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit customer' : 'New customer'}
        description={
          transportTypesQuery.isError
            ? getErrorMessage(transportTypesQuery.error)
            : 'Fill in the customer details.'
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form={FORM_ID} loading={isSaving}>
              {editing ? 'Save changes' : 'Create customer'}
            </Button>
          </>
        }
      >
        <CustomerForm
          key={editing?.id ?? 'new'}
          formId={FORM_ID}
          defaultValues={
            editing
              ? {
                  name: editing.name,
                  document: editing.document,
                  email: editing.email,
                  active: editing.active,
                  authorizedTransportTypeIds: editing.authorizedTransportTypeIds,
                }
              : emptyValues
          }
          transportTypes={activeTransportTypes}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}
