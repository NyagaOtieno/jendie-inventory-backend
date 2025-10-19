import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Testing connection to PostgreSQL via Prisma...');

  // Test connection
  const result = await prisma.$queryRaw`SELECT current_database() as db, now() as time;`;

  console.log('✅ Connected successfully!');
  console.log(result);

  // Optional: list all tables
  const tables = await prisma.$queryRaw`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public';
  `;
  console.log('📋 Tables in public schema:');
  console.table(tables);
}

main()
  .catch((e) => {
    console.error('❌ Connection failed:', e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
