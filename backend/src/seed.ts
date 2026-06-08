import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import prisma from './prisma';

dotenv.config();

async function main() {
  const password = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@realestate.com' },
    update: { password },
    create: {
      email: 'admin@realestate.com',
      password,
      name: 'Agency Admin',
      role: 'ADMIN',
    },
  });

  console.log('Admin user ready:', admin.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
