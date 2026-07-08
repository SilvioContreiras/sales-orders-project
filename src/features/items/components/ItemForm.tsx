import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, Input, Select, Textarea } from '@/shared/components/ui';
import { itemSchema, UNIT_OF_MEASURE_VALUES, type ItemFormValues } from '../schema';

interface ItemFormProps {
  formId: string;
  onSubmit: (values: ItemFormValues) => void;
}

const defaultValues: ItemFormValues = {
  sku: '',
  name: '',
  description: '',
  unitOfMeasure: 'UN',
  unitPrice: 0,
};

export function ItemForm({ formId, onSubmit }: ItemFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues,
  });

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="SKU" htmlFor="sku" required error={errors.sku?.message}>
        <Input id="sku" invalid={Boolean(errors.sku)} {...register('sku')} />
      </Field>

      <Field label="Name" htmlFor="name" required error={errors.name?.message}>
        <Input id="name" invalid={Boolean(errors.name)} {...register('name')} />
      </Field>

      <Field label="Description" htmlFor="description" error={errors.description?.message}>
        <Textarea id="description" rows={2} {...register('description')} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Unit of measure" htmlFor="unitOfMeasure" required>
          <Select id="unitOfMeasure" {...register('unitOfMeasure')}>
            {UNIT_OF_MEASURE_VALUES.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Unit price" htmlFor="unitPrice" required error={errors.unitPrice?.message}>
          <Input
            id="unitPrice"
            type="number"
            step="0.01"
            min="0"
            invalid={Boolean(errors.unitPrice)}
            {...register('unitPrice', { valueAsNumber: true })}
          />
        </Field>
      </div>
    </form>
  );
}
