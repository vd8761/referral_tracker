import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global;

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || "postgres://dummy:dummy@localhost:5432/dummy"
});

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
