import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, Input, Checkbox } from '@/shared/components/ui';
import { transportTypeSchema, type TransportTypeFormValues } from '../schema';

interface TransportTypeFormProps {
  formId: string;
  defaultValues: TransportTypeFormValues;
  onSubmit: (values: TransportTypeFormValues) => void;
}

export function TransportTypeForm({ formId, defaultValues, onSubmit }: TransportTypeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransportTypeFormValues>({
    resolver: zodResolver(transportTypeSchema),
    defaultValues,
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Name" htmlFor="name" required error={errors.name?.message}>
        <Input id="name" invalid={Boolean(errors.name)} {...register('name')} />
      </Field>

      <Field
        label="Code"
        htmlFor="code"
        required
        hint="Unique short code, e.g. TRUCK"
        error={errors.code?.message}
      >
        <Input id="code" invalid={Boolean(errors.code)} {...register('code')} />
      </Field>

      <Checkbox label="Active" {...register('active')} />
    </form>
  );
}
