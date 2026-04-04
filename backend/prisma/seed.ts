import { PrismaClient } from '../src/generated/prisma-client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding MK Academy English Learning Platform...');

  // Clear existing data (in correct order to satisfy foreign keys)
  await prisma.systemStats.deleteMany({});
  await prisma.financeTransaction.deleteMany({});
  await prisma.testAttempt.deleteMany({});
  await prisma.studentTask.deleteMany({});
  await prisma.groupMember.deleteMany({});
  await prisma.groupAssignment.deleteMany({});
  await prisma.groupCourse.deleteMany({});
  await prisma.group.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.test.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.vocabularyProgress.deleteMany({});
  await prisma.vocabulary.deleteMany({});
  await prisma.userProfile.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.user.deleteMany({});
  
  const defaultPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  // 1. Users
  const superadmin = await prisma.user.create({
    data: {
      fullName: 'Maqsud MK (Super Admin)',
      email: 'superadmin@mkacademy.uz',
      passwordHash: hashedPassword,
      role: 'SUPERADMIN' as any,
      cefrLevel: 'C2',
      profile: { create: { phone: '+998901234567', language: 'UZ' } }
    }
  });

  const teacher = await prisma.user.create({
    data: {
      fullName: 'John Smith (Senior Instructor)',
      email: 'teacher@mkacademy.uz',
      passwordHash: hashedPassword,
      role: 'TEACHER' as any,
      cefrLevel: 'C1',
      profile: { create: { phone: '+998910002233' } }
    }
  });

  const student = await prisma.user.create({
    data: {
      fullName: 'Moxirbek Coder (Student)',
      email: 'student@mkacademy.uz',
      passwordHash: hashedPassword,
      role: 'STUDENT' as any,
      cefrLevel: 'A2',
      profile: { create: { phone: '+998990001122' } }
    }
  });

  // 2. Courses
  const ieltsCourse = await prisma.course.create({
    data: {
      title: 'IELTS Intensive Mastery',
      description: 'Comprehensive preparation for the IELTS exam covering all four sections.',
      level: 'B2-C1',
      isActive: true
    }
  });

  const generalEnglish = await prisma.course.create({
    data: {
      title: 'General English - Essential B1',
      description: 'Foundational grammar and speaking for everyday life.',
      level: 'A2-B1',
      isActive: true
    }
  });

  // 3. Groups
  const group1 = await prisma.group.create({
    data: {
      name: 'IELTS Morning Stream',
      teacherId: teacher.id,
      inviteCode: 'IELTS2026',
      courses: { create: { courseId: ieltsCourse.id } }
    }
  });

  await prisma.groupMember.create({
    data: { groupId: group1.id, studentId: student.id }
  });

  // 4. Tasks & Tests for Courses
  await prisma.task.create({
    data: {
      title: 'IELTS Writing Task 1 - Maps',
      courseId: ieltsCourse.id,
      type: 'WRITING',
      maxScore: 100,
      createdById: teacher.id
    }
  });

  await prisma.test.create({
     data: {
        title: 'Mid-term IELTS Mock Test',
        courseId: ieltsCourse.id,
        createdById: teacher.id,
        timeLimit: 120
     }
  });

  // 5. Finance Transactions
  await prisma.financeTransaction.createMany({
    data: [
      { amount: 1200000, type: 'INCOME', method: 'PAYME', status: 'COMPLETED', userId: student.id, reason: 'IELTS Course Tuition' },
      { amount: 500000, type: 'INCOME', method: 'CLICK', status: 'COMPLETED', userId: student.id, reason: 'Books Purchase' },
      { amount: 3000000, type: 'EXPENSE', method: 'CASH', status: 'COMPLETED', reason: 'Office Rent' },
    ]
  });

  // 6. System Stats
  await prisma.systemStats.create({
    data: {
      cpuUsage: 12.4,
      ramFree: 6.8,
      diskSpace: 124.5,
      network: 42,
      uptimePerc: 99.99
    }
  });

  console.log('✅ Ultra-Realistic Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
