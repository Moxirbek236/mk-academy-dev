import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../src/core/enums/index';

const prisma = new PrismaClient();

async function main() {
  const phone = '+998917940303';
  const password = 'mcacademy';

  const existingUser = await prisma.user.findUnique({
    where: { phone },
    select: { id: true, fullName: true },
  });

  const user =
    existingUser ||
    (await prisma.user.create({
      data: {
        phone,
        passwordHash: await bcrypt.hash(password, 10),
        fullName: 'Super Admin',
        role: UserRole.SUPERADMIN,
        isActive: true,
      },
      select: { id: true, fullName: true },
    }));

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
    },
  });

  console.log(`Seed ready for ${user.fullName} (${phone})`);
}

main()
  .catch((error) => {
    console.error('Seed error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
