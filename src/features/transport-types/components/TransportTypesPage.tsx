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
import { getErrorMessage } from '@/shared/lib/errors';
import type { TransportType } from '@/shared/types';
import { useTransportTypes, useCreateTransportType, useUpdateTransportType } from '../queries';
import type { TransportTypeFormValues } from '../schema';
import { TransportTypeForm } from './TransportTypeForm';

const FORM_ID = 'transport-type-form';

const emptyValues: TransportTypeFormValues = { name: '', code: '', active: true };

export function TransportTypesPage() {
  const transportTypesQuery = useTransportTypes();
  const createTransportType = useCreateTransportType();
  const updateTransportType = useUpdateTransportType();

  const [editing, setEditing] = useState<TransportType | null>(null);
  const [open, setOpen] = useState(false);

  const isSaving = createTransportType.isPending || updateTransportType.isPending;

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(transportType: TransportType) {
    setEditing(transportType);
    setOpen(true);
  }

  function handleSubmit(values: TransportTypeFormValues) {
    const options = { onSuccess: () => setOpen(false) };
    if (editing) {
      updateTransportType.mutate({ id: editing.id, payload: values }, options);
    } else {
      createTransportType.mutate(values, options);
    }
  }

  const columns: Column<TransportType>[] = [
    { header: 'Name', cell: (t) => <span className="font-medium text-slate-900">{t.name}</span> },
    { header: 'Code', cell: (t) => <Badge>{t.code}</Badge> },
    {
      header: 'Status',
      cell: (t) =>
        t.active ? (
          <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
        ) : (
          <Badge className="bg-slate-100 text-slate-500">Inactive</Badge>
        ),
    },
    {
      header: '',
      align: 'right',
      cell: (t) => (
        <Button variant="ghost" size="sm" onClick={() => openEdit(t)}>
          <Pencil className="size-4" />
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Transport Types"
        description="Register transport modalities available to customers."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            New transport type
          </Button>
        }
      />

      <Card>
        {transportTypesQuery.isPending ? (
          <LoadingState label="Loading transport types..." />
        ) : transportTypesQuery.isError ? (
          <ErrorState message={getErrorMessage(transportTypesQuery.error)} />
        ) : transportTypesQuery.data.length === 0 ? (
          <EmptyState message="No transport types registered yet." />
        ) : (
          <DataTable columns={columns} rows={transportTypesQuery.data} rowKey={(t) => t.id} />
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit transport type' : 'New transport type'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form={FORM_ID} loading={isSaving}>
              {editing ? 'Save changes' : 'Create transport type'}
            </Button>
          </>
        }
      >
        <TransportTypeForm
          key={editing?.id ?? 'new'}
          formId={FORM_ID}
          defaultValues={
            editing
              ? { name: editing.name, code: editing.code, active: editing.active }
              : emptyValues
          }
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}
