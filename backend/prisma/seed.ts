import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CefrLevel, UserRole } from '../src/core/enums/index';

const prisma = new PrismaClient();
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT || 10);

type DevUserSeed = {
  phone: string;
  password: string;
  fullName: string;
  role: UserRole;
  cefrLevel?: CefrLevel;
};

const DEV_USERS: DevUserSeed[] = [
  {
    phone: '+998917940303',
    password: 'mcacademy',
    fullName: 'Dev Super Admin',
    role: UserRole.SUPERADMIN,
  },
  {
    phone: '+998901112211',
    password: 'admin123',
    fullName: 'Dev Admin',
    role: UserRole.ADMIN,
  },
  {
    phone: '+998901112233',
    password: 'teacher123',
    fullName: 'Mr. Smith (Teacher)',
    role: UserRole.TEACHER,
    cefrLevel: CefrLevel.C1,
  },
  {
    phone: '+998909998877',
    password: 'student123',
    fullName: 'John Doe (Student)',
    role: UserRole.STUDENT,
    cefrLevel: CefrLevel.B1,
  },
  {
    phone: '+998909998878',
    password: 'student123',
    fullName: 'Jane Roe (Student)',
    role: UserRole.STUDENT,
    cefrLevel: CefrLevel.B2,
  },
];

async function ensureUser(seed: DevUserSeed) {
  const passwordHash = await bcrypt.hash(seed.password, SALT_ROUNDS);

  const user = await prisma.user.upsert({
    where: { phone: seed.phone },
    update: {
      fullName: seed.fullName,
      role: seed.role,
      cefrLevel: seed.cefrLevel ?? null,
      isActive: true,
      passwordHash,
    },
    create: {
      phone: seed.phone,
      passwordHash,
      fullName: seed.fullName,
      role: seed.role,
      cefrLevel: seed.cefrLevel ?? null,
      isActive: true,
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    update: { isActive: true },
    create: { userId: user.id, isActive: true },
  });

  return user;
}

async function ensureCourse(
  title: string,
  description: string,
  level: CefrLevel,
) {
  const existing = await prisma.course.findFirst({
    where: { title },
    select: { id: true },
  });

  if (existing) {
    return prisma.course.update({
      where: { id: existing.id },
      data: {
        description,
        level,
        isActive: true,
      },
    });
  }

  return prisma.course.create({
    data: {
      title,
      description,
      level,
      isActive: true,
    },
  });
}

async function ensureTest(
  teacherId: number,
  courseId: number,
  title: string,
  description: string,
) {
  const existing = await prisma.test.findFirst({
    where: { title, createdById: teacherId },
    select: { id: true },
  });

  if (existing) {
    return prisma.test.update({
      where: { id: existing.id },
      data: {
        description,
        type: 'PRACTICE',
        cefrLevel: CefrLevel.B1,
        passingScore: 60,
        timeLimitMinutes: 45,
        isPublished: true,
        isActive: true,
        courseId,
      },
    });
  }

  return prisma.test.create({
    data: {
      title,
      description,
      type: 'PRACTICE',
      cefrLevel: CefrLevel.B1,
      passingScore: 60,
      timeLimitMinutes: 45,
      isPublished: true,
      isActive: true,
      createdById: teacherId,
      courseId,
    },
  });
}

async function ensureQuestion(
  testId: number,
  question: {
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    type: string;
    points: number;
    difficulty: number;
    skill: string;
  },
) {
  const existing = await prisma.question.findFirst({
    where: {
      testId,
      questionText: question.questionText,
    },
    select: { id: true },
  });

  const writeData = {
    testId,
    questionText: question.questionText,
    options: JSON.stringify(question.options),
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    type: question.type,
    inputType: 'OPTIONS',
    points: question.points,
    difficulty: question.difficulty,
    skill: question.skill,
    isActive: true,
  };

  const saved = existing
    ? await prisma.question.update({
        where: { id: existing.id },
        data: writeData,
      })
    : await prisma.question.create({
        data: writeData,
      });

  await prisma.questionAnalytics.upsert({
    where: { questionId: saved.id },
    update: { isActive: true },
    create: {
      questionId: saved.id,
      totalAttempts: 0,
      correctCount: 0,
      avgTimeSeconds: 0,
      isActive: true,
    },
  });

  return saved;
}

async function main() {
  console.log('--- Seeding development database ---');

  const [superAdmin, admin, teacher, studentOne, studentTwo] =
    await Promise.all(DEV_USERS.map((user) => ensureUser(user)));

  const group = await prisma.group.upsert({
    where: { inviteCode: 'DEV-ENG-2026' },
    update: {
      name: 'Development English Group',
      description: 'Default dev group for local testing',
      teacherId: teacher.id,
      isActive: true,
    },
    create: {
      name: 'Development English Group',
      description: 'Default dev group for local testing',
      teacherId: teacher.id,
      inviteCode: 'DEV-ENG-2026',
      isActive: true,
    },
  });

  await prisma.groupMember.upsert({
    where: {
      groupId_studentId: {
        groupId: group.id,
        studentId: studentOne.id,
      },
    },
    update: { status: 'ACTIVE', isActive: true },
    create: {
      groupId: group.id,
      studentId: studentOne.id,
      status: 'ACTIVE',
      isActive: true,
    },
  });

  await prisma.groupMember.upsert({
    where: {
      groupId_studentId: {
        groupId: group.id,
        studentId: studentTwo.id,
      },
    },
    update: { status: 'ACTIVE', isActive: true },
    create: {
      groupId: group.id,
      studentId: studentTwo.id,
      status: 'ACTIVE',
      isActive: true,
    },
  });

  const courseOne = await ensureCourse(
    'Unit 1: Tenses Mastery',
    'Deep dive into Present and Past tenses.',
    CefrLevel.B1,
  );
  const courseTwo = await ensureCourse(
    'Unit 2: Conditionals',
    'Zero, first, second and third conditionals.',
    CefrLevel.B1,
  );

  await prisma.groupCourse.upsert({
    where: { groupId_courseId: { groupId: group.id, courseId: courseOne.id } },
    update: { isActive: true },
    create: { groupId: group.id, courseId: courseOne.id, isActive: true },
  });

  await prisma.groupCourse.upsert({
    where: { groupId_courseId: { groupId: group.id, courseId: courseTwo.id } },
    update: { isActive: true },
    create: { groupId: group.id, courseId: courseTwo.id, isActive: true },
  });

  const grammarTest = await ensureTest(
    teacher.id,
    courseOne.id,
    'Mid-term Grammar Exam',
    'Covers major grammar topics from Unit 1 and Unit 2.',
  );

  const seededQuestions = await Promise.all([
    ensureQuestion(grammarTest.id, {
      questionText: 'Which sentence is in the Present Perfect?',
      options: ['I go', 'I went', 'I have gone', 'I am going'],
      correctAnswer: 'I have gone',
      explanation: 'Present Perfect uses have/has + past participle.',
      type: 'MCQ',
      points: 10,
      difficulty: 2,
      skill: 'GRAMMAR',
    }),
    ensureQuestion(grammarTest.id, {
      questionText: 'If I ______ a bird, I would fly.',
      options: ['am', 'was', 'were', 'been'],
      correctAnswer: 'were',
      explanation: 'Second conditional uses "were" for all subjects.',
      type: 'MCQ',
      points: 10,
      difficulty: 2,
      skill: 'GRAMMAR',
    }),
    ensureQuestion(grammarTest.id, {
      questionText: 'Choose the correctly punctuated sentence.',
      options: [
        'Lets eat grandma',
        "Let's eat, grandma",
        'Lets, eat grandma',
        "Let's eat grandma.",
      ],
      correctAnswer: "Let's eat, grandma",
      explanation:
        'Comma changes meaning and apostrophe is required in "let\'s".',
      type: 'MCQ',
      points: 5,
      difficulty: 1,
      skill: 'WRITING',
    }),
  ]);

  const existingAssignment = await prisma.groupAssignment.findFirst({
    where: {
      groupId: group.id,
      testId: grammarTest.id,
      isActive: true,
    },
    select: { id: true },
  });

  if (!existingAssignment) {
    await prisma.groupAssignment.create({
      data: {
        groupId: group.id,
        testId: grammarTest.id,
        isRequired: true,
        isActive: true,
      },
    });
  }

  const vocabSeed = [
    {
      word: 'enthusiastic',
      translation: 'ishtiyoqli',
      cefrLevel: CefrLevel.B1,
    },
    { word: 'resilient', translation: 'chidamli', cefrLevel: CefrLevel.B2 },
    { word: 'pragmatic', translation: 'amaliy', cefrLevel: CefrLevel.C1 },
  ];

  for (const item of vocabSeed) {
    await prisma.vocabulary.upsert({
      where: { word: item.word },
      update: {
        translation: item.translation,
        cefrLevel: item.cefrLevel,
        isActive: true,
      },
      create: {
        word: item.word,
        translation: item.translation,
        cefrLevel: item.cefrLevel,
        difficulty: 2,
        isActive: true,
      },
    });
  }

  const booksSeed = [
    {
      title: 'English Grammar in Use',
      author: 'Raymond Murphy',
      description: 'Popular grammar guide for intermediate learners.',
      fileUrl: 'https://example.com/english-grammar-in-use.pdf',
      cefrLevel: CefrLevel.B1,
    },
    {
      title: 'Advanced Grammar in Use',
      author: 'Martin Hewings',
      description: 'Reference book for advanced learners.',
      fileUrl: 'https://example.com/advanced-grammar-in-use.pdf',
      cefrLevel: CefrLevel.C1,
    },
  ];

  for (const book of booksSeed) {
    await prisma.book.upsert({
      where: { fileUrl: book.fileUrl },
      update: {
        title: book.title,
        author: book.author,
        description: book.description,
        cefrLevel: book.cefrLevel,
        isActive: true,
      },
      create: {
        ...book,
        isActive: true,
      },
    });
  }

  console.log('--- Development seed completed ---');
  console.log('Users:');
  console.log(`- SUPERADMIN: ${superAdmin.phone} / mcacademy`);
  console.log(`- ADMIN:      ${admin.phone} / admin123`);
  console.log(`- TEACHER:    ${teacher.phone} / teacher123`);
  console.log(`- STUDENT 1:  ${studentOne.phone} / student123`);
  console.log(`- STUDENT 2:  ${studentTwo.phone} / student123`);
  console.log(`Seeded questions: ${seededQuestions.length}`);
}

main()
  .catch((error) => {
    console.error('Seed error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
