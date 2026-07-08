import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, Input, Checkbox } from '@/shared/components/ui';
import type { TransportType } from '@/shared/types';
import { customerSchema, type CustomerFormValues } from '../schema';

interface CustomerFormProps {
  formId: string;
  defaultValues: CustomerFormValues;
  transportTypes: TransportType[];
  onSubmit: (values: CustomerFormValues) => void;
}

export function CustomerForm({
  formId,
  defaultValues,
  transportTypes,
  onSubmit,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Name" htmlFor="name" required error={errors.name?.message}>
        <Input id="name" invalid={Boolean(errors.name)} {...register('name')} />
      </Field>

      <Field
        label="Document (CNPJ)"
        htmlFor="document"
        required
        hint="14 digits, numbers only"
        error={errors.document?.message}
      >
        <Input id="document" invalid={Boolean(errors.document)} {...register('document')} />
      </Field>

      <Field label="Email" htmlFor="email" required error={errors.email?.message}>
        <Input id="email" type="email" invalid={Boolean(errors.email)} {...register('email')} />
      </Field>

      <Field
        label="Authorized transport types"
        required
        error={errors.authorizedTransportTypeIds?.message}
      >
        <div className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3">
          {transportTypes.length === 0 ? (
            <p className="text-sm text-slate-500">No transport types available.</p>
          ) : (
            transportTypes.map((transportType) => (
              <Checkbox
                key={transportType.id}
                label={`${transportType.name} (${transportType.code})`}
                value={transportType.id}
                {...register('authorizedTransportTypeIds')}
              />
            ))
          )}
        </div>
      </Field>

      <Checkbox label="Active" {...register('active')} />
    </form>
  );
}
