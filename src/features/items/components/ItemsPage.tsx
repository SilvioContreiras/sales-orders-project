import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { PageHeader } from '@/shared/components/PageHeader';
import {
  Badge,
  Button,
  Card,
  DataTable,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  Modal,
  type Column,
} from '@/shared/components/ui';
import { formatCurrency } from '@/shared/utils/format';
import { getErrorMessage } from '@/shared/lib/errors';
import type { Item } from '@/shared/types';
import { useItems, useCreateItem } from '../queries';
import type { ItemFormValues } from '../schema';
import { ItemForm } from './ItemForm';

const FORM_ID = 'item-form';

export function ItemsPage() {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const itemsQuery = useItems(search.trim() || undefined);
  const createItem = useCreateItem();

  function handleSubmit(values: ItemFormValues) {
    createItem.mutate(values, { onSuccess: () => setOpen(false) });
  }

  const columns: Column<Item>[] = [
    { header: 'SKU', cell: (i) => <Badge>{i.sku}</Badge> },
    { header: 'Name', cell: (i) => <span className="font-medium text-slate-900">{i.name}</span> },
    { header: 'Unit', cell: (i) => i.unitOfMeasure },
    { header: 'Unit price', align: 'right', cell: (i) => formatCurrency(i.unitPrice) },
  ];

  return (
    <div>
      <PageHeader
        title="Items"
        description="Catalog items available to be added to sales orders."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            New item
          </Button>
        }
      />

      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Search by SKU or name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <Card>
        {itemsQuery.isPending ? (
          <LoadingState label="Loading items..." />
        ) : itemsQuery.isError ? (
          <ErrorState message={getErrorMessage(itemsQuery.error)} />
        ) : itemsQuery.data.length === 0 ? (
          <EmptyState message="No items found." />
        ) : (
          <DataTable columns={columns} rows={itemsQuery.data} rowKey={(i) => i.id} />
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New item"
        description="Register a new catalog item."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form={FORM_ID} loading={createItem.isPending}>
              Create item
            </Button>
          </>
        }
      >
        <ItemForm formId={FORM_ID} onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}
