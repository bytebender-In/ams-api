// test-prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('Connecting to the database...');
  await prisma.$connect();
  console.log('✅ Connection successful!');
  await prisma.$disconnect();
  console.log('🔌 Disconnected.');
}

main().catch((e) => {
  console.error('❌ Error connecting to database:', e);
  process.exit(1);
});
