import { PrismaClient,  } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserRole } from "../src/core/enums/index";

const prisma = new PrismaClient();

async function main() {
  const phone = '+998917940303';
  const password = 'mcacademy';

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: { phone },
    select: { id: true },
  });

   const userProfile = await prisma.userProfile.create({
    data: {
      userId: existingUser!.id,
    },
  });

  console.log(userProfile);
  


  if (existingUser) {
    console.log('⚠️ SuperAdmin already exists');
    return;
  }

//   const superAdmin = await prisma.user.create({
//     data: {
//       phone,
//       passwordHash: hashedPassword,
//       fullName: 'Super Admin',
//       role: UserRole.SUPERADMIN, // ⚠️ enumga qarab tekshir
//       isActive: true,
//     },
//   });

 
  console.log('✅ SuperAdmin created:');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });