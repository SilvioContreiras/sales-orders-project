import { z } from 'zod';

export const salesOrderSchema = z.object({
  customerId: z.string().min(1, 'Select a customer'),
  transportTypeId: z.string().min(1, 'Select a transport type'),
  items: z
    .array(
      z.object({
        itemId: z.string().min(1, 'Select an item'),
        quantity: z
          .number({ message: 'Quantity is required' })
          .int('Quantity must be a whole number')
          .positive('Quantity must be greater than zero'),
      }),
    )
    .min(1, 'Add at least one item'),
});

export type SalesOrderFormValues = z.infer<typeof salesOrderSchema>;

export const SERVICE_WINDOW_VALUES = ['MORNING', 'AFTERNOON', 'EVENING'] as const;

export const scheduleSchema = z.object({
  deliveryDate: z.string().min(1, 'Select a delivery date'),
  window: z.enum(SERVICE_WINDOW_VALUES),
});

export type ScheduleFormValues = z.infer<typeof scheduleSchema>;
