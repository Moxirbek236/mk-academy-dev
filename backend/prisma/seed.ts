import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding MK Academy English Learning Platform...');

  // Clear existing data
  await prisma.user.deleteMany({});
  
  const defaultPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  // 1. Superadmin User
  const superadmin = await prisma.user.create({
    data: {
      fullName: 'Maqsud (Super Admin)',
      email: 'superadmin@mkacademy.uz',
      passwordHash: hashedPassword,
      role: 'SUPERADMIN',
      cefrLevel: 'C2',
      isActive: true,
      profile: {
        create: {
          phone: '+998901234567',
          language: 'UZ',
          timezone: 'Asia/Tashkent',
        }
      }
    }
  });

  // 2. Admin User
  const admin = await prisma.user.create({
    data: {
      fullName: 'Sardor (Admin)',
      email: 'admin@mkacademy.uz',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      cefrLevel: 'C1',
      isActive: true,
      profile: {
        create: {
          phone: '+998901112233',
        }
      }
    }
  });

  // 3. English Teacher
  const teacher = await prisma.user.create({
    data: {
      fullName: 'Mr. Johnson (Teacher)',
      email: 'teacher@mkacademy.uz',
      passwordHash: hashedPassword,
      role: 'TEACHER',
      cefrLevel: 'C2',
      isActive: true,
      profile: {
        create: {
          phone: '+998902223344',
        }
      }
    }
  });

  // 4. Student
  const student = await prisma.user.create({
    data: {
      fullName: 'Odiljon (Student)',
      email: 'student@mkacademy.uz',
      passwordHash: hashedPassword,
      role: 'STUDENT',
      cefrLevel: 'A2',
      isActive: true,
      profile: {
        create: {
          phone: '+998905556677',
        }
      }
    }
  });

  // 5. Demo Vocabulary (English words)
  const words = [
    { word: 'determine', translation: 'aniqlash, belgilash', partOfSpeech: 'verb', exampleSentence: 'We need to determine the cause of the problem.', difficulty: 3, cefrLevel: 'B1' },
    { word: 'acknowledge', translation: "tan olish, e'tirof etish", partOfSpeech: 'verb', exampleSentence: 'She refused to acknowledge her mistake.', difficulty: 4, cefrLevel: 'B2' },
    { word: 'significant', translation: "muhim, ahamiyatli", partOfSpeech: 'adjective', exampleSentence: 'There has been a significant improvement.', difficulty: 3, cefrLevel: 'B1' },
    { word: 'accomplish', translation: "amalga oshirish, erishish", partOfSpeech: 'verb', exampleSentence: 'She accomplished all her goals this year.', difficulty: 4, cefrLevel: 'B2' },
    { word: 'enthusiasm', translation: "ishtiyoq, zavq", partOfSpeech: 'noun', exampleSentence: 'He showed great enthusiasm for learning English.', difficulty: 3, cefrLevel: 'B1' },
    { word: 'reluctant', translation: "istaksiz, xohlamagan", partOfSpeech: 'adjective', exampleSentence: 'She was reluctant to speak in public.', difficulty: 4, cefrLevel: 'B2' },
    { word: 'elaborate', translation: "batafsil tushuntirish", partOfSpeech: 'verb', exampleSentence: 'Could you elaborate on your answer?', difficulty: 5, cefrLevel: 'C1' },
    { word: 'persuade', translation: "ishontirish, ko'ndirish", partOfSpeech: 'verb', exampleSentence: 'I tried to persuade him to study harder.', difficulty: 3, cefrLevel: 'B1' },
  ];

  for (const w of words) {
    await prisma.vocabulary.create({ 
       data: { ...w, cefrLevel: w.cefrLevel as any } 
    });
  }

  // 6. Demo Achievement
  await prisma.achievement.create({
    data: {
      title: 'First Steps',
      description: "Birinchi darsni muvaffaqiyatli yakunladingiz!",
      conditionType: 'lessons_completed',
      conditionValue: 1,
      xpReward: 50,
      badgeColor: '#3D855A',
    }
  });

  await prisma.achievement.create({
    data: {
      title: 'Word Master',
      description: "50 ta ingliz so'zini o'zlashtirdingiz!",
      conditionType: 'words_mastered',
      conditionValue: 50,
      xpReward: 200,
      badgeColor: '#FFD700',
    }
  });

  console.log('');
  console.log('✅ Seeding finished successfully!');
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║     🎓 MK ACADEMY - LOGIN CREDENTIALS       ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log('║  🔑 Barcha parollar: Password123!            ║');
  console.log('║                                              ║');
  console.log('║  👑 Superadmin: superadmin@mkacademy.uz       ║');
  console.log('║  🛠️  Admin:      admin@mkacademy.uz            ║');
  console.log('║  👨‍🏫 Teacher:    teacher@mkacademy.uz          ║');
  console.log('║  🎓 Student:    student@mkacademy.uz          ║');
  console.log('╚══════════════════════════════════════════════╝');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
