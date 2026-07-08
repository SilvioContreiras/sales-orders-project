import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/shared/components/PageHeader';
import {
  Badge,
  Card,
  DataTable,
  EmptyState,
  ErrorState,
  LoadingState,
  type Column,
} from '@/shared/components/ui';
import { formatDateTime } from '@/shared/utils/format';
import { getErrorMessage } from '@/shared/lib/errors';
import type { AuditEvent } from '@/shared/types';
import { useAuditEvents } from '../queries';
import { AUDIT_ACTION_BADGE_CLASSES, AUDIT_ACTION_LABELS } from '../labels';

export function AuditPage() {
  const auditQuery = useAuditEvents();

  const columns: Column<AuditEvent>[] = [
    { header: 'When', cell: (e) => formatDateTime(e.timestamp) },
    {
      header: 'Action',
      cell: (e) => (
        <Badge className={AUDIT_ACTION_BADGE_CLASSES[e.action]}>
          {AUDIT_ACTION_LABELS[e.action]}
        </Badge>
      ),
    },
    {
      header: 'Entity',
      cell: (e) => <span className="font-medium text-slate-900">{e.entityLabel}</span>,
    },
    {
      header: 'Change',
      cell: (e) => (
        <span className="flex items-center gap-2 text-slate-600">
          <span>{e.previousState ?? '—'}</span>
          <ArrowRight className="size-3.5 text-slate-400" />
          <span className="font-medium text-slate-900">{e.nextState ?? '—'}</span>
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Audit Trail"
        description="Chronological record of relevant changes for traceability."
      />

      <Card>
        {auditQuery.isPending ? (
          <LoadingState label="Loading audit events..." />
        ) : auditQuery.isError ? (
          <ErrorState message={getErrorMessage(auditQuery.error)} />
        ) : auditQuery.data.length === 0 ? (
          <EmptyState message="No audit events recorded yet." />
        ) : (
          <DataTable columns={columns} rows={auditQuery.data} rowKey={(e) => e.id} />
        )}
      </Card>
    </div>
  );
}
