import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserRole, CefrLevel, TaskType } from '../src/core/enums/index';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Data Population ---');

  // 1. Create a Teacher
  const teacherPhone = '+998901112233';
  const teacher = await prisma.user.upsert({
    where: { phone: teacherPhone },
    update: {},
    create: {
      phone: teacherPhone,
      passwordHash: await bcrypt.hash('teacher123', 10),
      fullName: 'Mr. Smith (Teacher)',
      role: UserRole.TEACHER,
      isActive: true,
    },
  });
  console.log('Teacher created:', teacher.fullName);

  // 2. Create a Student
  const studentPhone = '+998909998877';
  const student = await prisma.user.upsert({
    where: { phone: studentPhone },
    update: {},
    create: {
      phone: studentPhone,
      passwordHash: await bcrypt.hash('student123', 10),
      fullName: 'John Doe (Student)',
      role: UserRole.STUDENT,
      cefrLevel: CefrLevel.B1,
      isActive: true,
    },
  });
  console.log('Student created:', student.fullName);

  // 3. Create a Group
  const group = await prisma.group.upsert({
    where: { inviteCode: 'ENG-PRO-2026' },
    update: {},
    create: {
      name: 'Advanced English 2026',
      description: 'Main group for advanced English learners',
      teacherId: teacher.id,
      inviteCode: 'ENG-PRO-2026',
      isActive: true,
    },
  });
  console.log('Group created:', group.name);

  // 4. Add Student to Group
  await prisma.groupMember.upsert({
    where: { groupId_studentId: { groupId: group.id, studentId: student.id } },
    update: { status: 'ACTIVE', isActive: true },
    create: {
      groupId: group.id,
      studentId: student.id,
      status: 'ACTIVE',
      isActive: true,
    },
  });
  console.log(`Student ${student.fullName} added to group ${group.name}`);

  // 5. Create Courses (Units)
  const coursesData = [
    { title: 'Unit 1: Tenses Mastery', description: 'Deep dive into Present and Past Tenses', level: CefrLevel.B1 },
    { title: 'Unit 2: Conditional Sentences', description: 'Understanding Zero, First, Second, and Third Conditionals', level: CefrLevel.B1 },
  ];

  for (const courseData of coursesData) {
    const course = await prisma.course.upsert({
      where: { title: courseData.title },
      update: {},
      create: { ...courseData, isActive: true },
    });
    console.log('Course created:', course.title);

    // Assign Course to Group
    await prisma.groupCourse.upsert({
      where: { groupId_courseId: { groupId: group.id, courseId: course.id } },
      update: { isActive: true },
      create: { groupId: group.id, courseId: course.id, isActive: true },
    });
  }

  // 6. Create Tests (Exams)
  const test1 = await prisma.test.create({
    data: {
      title: 'Mid-term Grammar Exam',
      description: 'Covers all topics from Unit 1 and 2',
      type: 'PRACTICE',
      cefrLevel: CefrLevel.B1,
      timeLimitMinutes: 45,
      passingScore: 60,
      isActive: true,
      questions: {
        create: [
          {
            questionText: 'Which sentence is in the Present Perfect?',
            options: JSON.stringify(['I go', 'I went', 'I have gone', 'I am going']),
            correctAnswer: 'I have gone',
            points: 10,
            type: 'MCQ',
          },
          {
            questionText: 'If I ______ a bird, I would fly.',
            options: JSON.stringify(['am', 'was', 'were', 'been']),
            correctAnswer: 'were',
            points: 10,
            type: 'MCQ',
          },
        ],
      },
    },
  });
  console.log('Test created:', test1.title);

  // 7. Create Vocabulary
  const vocabData = [
    { word: 'Enthusiastic', translation: 'Ghayratli, ishtiyoqli', cefrLevel: CefrLevel.B1, difficulty: 2 },
    { word: 'Pragmatic', translation: 'Amaliy, realistik', cefrLevel: CefrLevel.C1, difficulty: 3 },
    { word: 'Resilient', translation: 'Chidamli, egiluvchan', cefrLevel: CefrLevel.B2, difficulty: 3 },
  ];

  for (const v of vocabData) {
    await prisma.vocabulary.upsert({
      where: { word: v.word },
      update: {},
      create: { ...v, isActive: true },
    });
  }
  console.log('Vocabulary added.');

  // 8. Create Books
  const booksData = [
    {
      title: 'English Grammar in Use',
      author: 'Raymond Murphy',
      description: 'The world\'s best-selling grammar book for intermediate learners.',
      fileUrl: 'https://example.com/murphy-intermediate.pdf',
      cefrLevel: CefrLevel.B1,
    },
    {
      title: 'Advanced Grammar in Use',
      author: 'Martin Hewings',
      description: 'A self-study reference and practice book for advanced learners of English.',
      fileUrl: 'https://example.com/hewings-advanced.pdf',
      cefrLevel: CefrLevel.C1,
    },
  ];

  for (const book of booksData) {
    await prisma.book.create({
      data: { ...book, isActive: true },
    });
  }
  console.log('English Grammar books added.');

  console.log('--- Data Population Complete ---');
}

main()
  .catch((e) => {
    console.error('Error during data population:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
