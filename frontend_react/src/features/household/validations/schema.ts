import { z } from 'zod';

const categories = [
  '食費',
  '日用品',
  '住居費',
  '交際費',
  '娯楽',
  '交通費',
  '給与',
  '副収入',
  '児童手当',
] as const;

const types = ['income', 'expense'] as const;

export const transactionSchema = z.object({
  type: z.string().refine((val) => (types as readonly string[]).includes(val), {
    message: 'カテゴリを選択してください',
  }),
  date: z.string().min(1, { message: '日付は必須です' }),
  amount: z.number().min(1, { message: '金額は一円以上が必須です' }),
  content: z
    .string()
    .min(1, { message: '内容を入力してください' })
    .max(50, { message: '内容は50字以内です' }),
  category: z
    .string()
    .refine((val) => (categories as readonly string[]).includes(val), {
      message: 'カテゴリを選択してください',
    }),
});

export type Schema = z.infer<typeof transactionSchema>
