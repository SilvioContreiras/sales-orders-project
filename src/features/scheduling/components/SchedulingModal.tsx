import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Field, Modal, Select, Input } from '@/shared/components/ui';
import type { SalesOrder } from '@/shared/types';
import { useUpdateSchedule, useConfirmSchedule } from '@/features/sales-orders/queries';
import {
  scheduleSchema,
  SERVICE_WINDOW_VALUES,
  type ScheduleFormValues,
} from '@/features/sales-orders/schema';
import { WINDOW_LABELS } from '@/features/sales-orders/domain/schedule';

interface SchedulingModalProps {
  open: boolean;
  onClose: () => void;
  order: SalesOrder | null;
}

export function SchedulingModal({ open, onClose, order }: SchedulingModalProps) {
  const updateSchedule = useUpdateSchedule();
  const confirmSchedule = useConfirmSchedule();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      deliveryDate: order?.schedule?.deliveryDate ?? '',
      window: order?.schedule?.window ?? 'MORNING',
    },
  });

  if (!order) return null;

  const isSaving = updateSchedule.isPending || confirmSchedule.isPending;

  function persist(values: ScheduleFormValues, confirm: boolean) {
    if (!order) return;
    const currentOrder = order;
    updateSchedule.mutate(
      {
        id: currentOrder.id,
        payload: values,
        previousSchedule: currentOrder.schedule,
        silent: confirm,
      },
      {
        onSuccess: () => {
          if (!confirm) {
            onClose();
            return;
          }
          confirmSchedule.mutate(
            {
              id: currentOrder.id,
              previousStatus: currentOrder.status,
              previousSchedule: currentOrder.schedule,
            },
            { onSuccess: onClose },
          );
        },
      },
    );
  }

  const isReschedule = order.status === 'SCHEDULED';

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={isReschedule ? `Reagendar ${order.code}` : `Agendar ${order.code}`}
      description="Defina a data de entrega e a janela de atendimento."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="secondary"
            onClick={handleSubmit((values) => persist(values, false))}
            loading={updateSchedule.isPending && !confirmSchedule.isPending}
          >
            Salvar como pendente
          </Button>
          <Button onClick={handleSubmit((values) => persist(values, true))} loading={isSaving}>
            Confirmar agendamento
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field
          label="Data de entrega"
          htmlFor="deliveryDate"
          required
          error={errors.deliveryDate?.message}
        >
          <Input
            id="deliveryDate"
            type="date"
            invalid={Boolean(errors.deliveryDate)}
            {...register('deliveryDate')}
          />
        </Field>

        <Field label="Janela de atendimento" htmlFor="window" required>
          <Select id="window" {...register('window')}>
            {SERVICE_WINDOW_VALUES.map((window) => (
              <option key={window} value={window}>
                {WINDOW_LABELS[window]}
              </option>
            ))}
          </Select>
        </Field>
      </div>
    </Modal>
  );
}
