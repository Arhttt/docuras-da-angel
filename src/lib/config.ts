import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().default('https://mock-doces-da-angel.supabase.co'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default('mock-anon-key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default('mock-service-role-key'),
  PAYMENT_MODE: z.enum(['mock', 'mercadopago']).default('mock'),
  MERCADOPAGO_ACCESS_TOKEN: z.string().optional(),
  MERCADOPAGO_WEBHOOK_SECRET: z.string().optional(),
  EMAIL_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('Doces da Angel <pedidos@docesdaangel.com.br>'),
  JOBS_SECRET: z.string().default('dev-jobs-secret-key'),
}).refine(
  (data) => {
    // In production, PAYMENT_MODE=mock is strictly forbidden
    if (data.NODE_ENV === 'production' && data.PAYMENT_MODE === 'mock') {
      return false;
    }
    return true;
  },
  {
    message: 'FATAL: PAYMENT_MODE=mock não pode ser utilizado em ambiente de produção.',
    path: ['PAYMENT_MODE'],
  }
);

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  PAYMENT_MODE: process.env.PAYMENT_MODE,
  MERCADOPAGO_ACCESS_TOKEN: process.env.MERCADOPAGO_ACCESS_TOKEN,
  MERCADOPAGO_WEBHOOK_SECRET: process.env.MERCADOPAGO_WEBHOOK_SECRET,
  EMAIL_API_KEY: process.env.EMAIL_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  JOBS_SECRET: process.env.JOBS_SECRET,
});
