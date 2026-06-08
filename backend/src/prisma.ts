import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let dbConnected = false;

export async function ensureDbConnected() {
  if (dbConnected) {
    return true;
  }

  try {
    await prisma.$connect();
    dbConnected = true;
    return true;
  } catch (error) {
    return false;
  }
}

export function markDbDisconnected() {
  dbConnected = false;
}

export default prisma;
