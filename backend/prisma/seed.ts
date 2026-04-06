import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Default admin user
    await prisma.user.create({
        data: {
            phone: '  +998901234567',
            passwordHash: 'admin',
            role: 'ADMIN',
            fullName: 'Admin',
            avatarUrl: 'https://example.com/admin.jpg',
            cefrLevel: 'A1',
            isActive: true,
        },
    });

    console.log('Seed finished.');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });