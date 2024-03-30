import { execSync } from "child_process";
import { randomUUID } from "crypto";
import { PrismaClient } from "@prisma/client";
import { Redis } from "ioredis";

function generateUniqueDataBaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a DATABSA_URL environment varible");
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set("schema", schema);
  return url.toString();
}

const schemaId = randomUUID();
process.env.DATABASE_URL = generateUniqueDataBaseUrl(schemaId);
process.env.REDIS_DB = "1";

beforeEach(async () => {
  const redis = new Redis({ db: Number(process.env.REDIS_DB) });
  await redis.flushdb();
  redis.disconnect();
  execSync("npx prisma migrate deploy");
});

afterEach(async () => {
  const prisma = new PrismaClient();
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
