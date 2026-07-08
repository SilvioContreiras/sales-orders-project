import { z } from 'zod';

export const UNIT_OF_MEASURE_VALUES = ['UN', 'KG', 'BOX', 'PALLET', 'LITER'] as const;

export const itemSchema = z.object({
  sku: z.string().trim().min(3, 'SKU must have at least 3 characters'),
  name: z.string().trim().min(2, 'Name must have at least 2 characters'),
  description: z.string().trim().optional(),
  unitOfMeasure: z.enum(UNIT_OF_MEASURE_VALUES),
  unitPrice: z
    .number({ message: 'Unit price is required' })
    .positive('Unit price must be greater than zero'),
});

export type ItemFormValues = z.infer<typeof itemSchema>;
