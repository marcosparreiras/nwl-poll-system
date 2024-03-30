import { Redis } from "ioredis";
import { env } from "../../env";

export const redis = new Redis({
  db: env.REDIS_DB,
});
