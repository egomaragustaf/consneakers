import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma-generated/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

let prisma = new PrismaClient({ adapter });

declare global {
  var __db__: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient({ adapter });
  }
  prisma = global.__db__;
}

export { prisma };
