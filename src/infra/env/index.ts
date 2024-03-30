import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(),
  REDIS_DB: z.coerce.number().default(0),
});

export const env = envSchema.parse(process.env);
