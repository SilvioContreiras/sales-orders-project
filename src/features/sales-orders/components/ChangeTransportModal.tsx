import { useState } from 'react';
import { Button, Field, Modal, Select } from '@/shared/components/ui';
import type { Customer, SalesOrder, TransportType } from '@/shared/types';
import { useUpdateTransport } from '../queries';

interface ChangeTransportModalProps {
  open: boolean;
  onClose: () => void;
  order: SalesOrder;
  customer: Customer | undefined;
  transportTypes: TransportType[];
}

export function ChangeTransportModal({
  open,
  onClose,
  order,
  customer,
  transportTypes,
}: ChangeTransportModalProps) {
  if (!open) return null;

  return (
    <ChangeTransportModalContent
      key={order.id}
      onClose={onClose}
      order={order}
      customer={customer}
      transportTypes={transportTypes}
    />
  );
}

function ChangeTransportModalContent({
  onClose,
  order,
  customer,
  transportTypes,
}: Omit<ChangeTransportModalProps, 'open'>) {
  const [transportTypeId, setTransportTypeId] = useState(order.transportTypeId);
  const updateTransport = useUpdateTransport();

  const labelOf = (id: string) => transportTypes.find((t) => t.id === id)?.name ?? id;
  const available = transportTypes.filter(
    (t) => t.active && customer?.authorizedTransportTypeIds.includes(t.id),
  );

  function handleConfirm() {
    updateTransport.mutate(
      {
        id: order.id,
        transportTypeId,
        previousTransportLabel: labelOf(order.transportTypeId),
        nextTransportLabel: labelOf(transportTypeId),
      },
      { onSuccess: onClose },
    );
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Alterar tipo de transporte"
      description="Apenas os tipos de transporte autorizados para o cliente são listados."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            loading={updateTransport.isPending}
            disabled={transportTypeId === order.transportTypeId}
          >
            Alterar transporte
          </Button>
        </>
      }
    >
      <Field label="Tipo de transporte" htmlFor="transport">
        <Select
          id="transport"
          value={transportTypeId}
          onChange={(event) => setTransportTypeId(event.target.value)}
        >
          {available.map((transport) => (
            <option key={transport.id} value={transport.id}>
              {transport.name} ({transport.code})
            </option>
          ))}
        </Select>
      </Field>
    </Modal>
  );
}
