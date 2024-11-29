import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  FRONTEND_BASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3333),
  SECRET_JWT_KEY: z.string(),
  MERCADO_PAGO_PUBLIC_KEY: z.string(),
  MERCADO_PAGO_ACCESS_TOKEN: z.string(),
});

export const env = envSchema.parse(process.env);
