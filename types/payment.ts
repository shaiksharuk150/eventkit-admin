import { z } from 'zod';

export const paymentSchema = z.object({
  payment_id: z.string().uuid(),
  account_id: z.string().uuid(),
  amount: z.number(),
  transaction_date: z.string(),
  payment_method: z.string().optional(),
  status: z.string().optional(),
});

export type Payment = z.infer<typeof paymentSchema>; 