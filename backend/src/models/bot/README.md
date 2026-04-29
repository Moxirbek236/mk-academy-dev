# CEFR IELTS Telegram Bot

NestJS, Telegraf, Prisma va PostgreSQL asosida yozilgan Telegram bot. Bot CEFR va IELTS o'quv markazi uchun mo'ljallangan bo'lib, admin va oddiy user flow alohida ishlaydi.

## Asosiy imkoniyatlar

- Admin va oddiy user menyulari alohida ishlaydi
- Admin statistikani ko'radi
- CEFR va IELTS natijalari bazadan olinadi
- Student qidirish ishlaydi
- Results channel post linklari saqlanadi va inline tugma bilan ochiladi
- Murojaat qoldirish flow: ism -> telefon -> kurs turi
- Center info, courses, results, leads va admin uchun REST endpointlar mavjud

## Texnologiyalar

- NestJS
- Telegraf (`nestjs-telegraf`)
- Prisma
- PostgreSQL
- TypeScript

## Loyiha strukturasi

```text
.
├── prisma
│   ├── schema.prisma
│   └── seed.ts
├── src
│   ├── admin
│   │   ├── dto
│   │   ├── admin.controller.ts
│   │   ├── admin.module.ts
│   │   └── admin.service.ts
│   ├── bot
│   │   ├── bot-state.service.ts
│   │   ├── bot.module.ts
│   │   ├── bot.service.ts
│   │   ├── bot.types.ts
│   │   └── bot.update.ts
│   ├── center-info
│   ├── common
│   │   ├── constants
│   │   └── filters
│   ├── courses
│   ├── leads
│   ├── prisma
│   ├── results
│   ├── app.module.ts
│   └── main.ts
├── .env.example
├── package.json
└── tsconfig.json
```

## O'rnatish

1. Dependencylarni o'rnating:

```bash
npm install
```

2. `.env.example` dan nusxa olib `.env` tayyorlang:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/cefr_ielts_bot
BOT_TOKEN=your_telegram_bot_token
MAIN_CHANNEL_ID=@your_main_channel_or_id
RESULTS_CHANNEL_ID=@your_results_channel_or_id
ADMIN_TELEGRAM_IDS=123456789,987654321
ADMIN_TELEGRAM_USERNAMES=admin_username,owner_username
PORT=3000
```

3. Prisma client yarating:

```bash
npm run prisma:generate
```

4. Migratsiya ishlating:

```bash
npm run prisma:migrate
```

5. Seed ma'lumotlarni yozing:

```bash
npm run prisma:seed
```

6. Botni ishga tushiring:

```bash
npm run start:dev
```

## Muhim env lar

- `BOT_TOKEN`: Telegram bot token
- `ADMIN_TELEGRAM_IDS`: vergul bilan ajratilgan admin Telegram user ID lar
- `ADMIN_TELEGRAM_USERNAMES`: vergul bilan ajratilgan admin username lar (`@` bilan yoki `@` siz)
- `MAIN_CHANNEL_ID`: asosiy kanal username yoki ID si
- `RESULTS_CHANNEL_ID`: natijalar kanali username yoki ID si
- `DATABASE_URL`: PostgreSQL ulanish satri

## Bot flow

### Oddiy user

- `/start` bosganda user menu chiqadi
- `O'quv markaz haqida`
- `Kurslar`
- `Natijalar`
- `Manzil`
- `Bog'lanish`
- `Murojaat qoldirish`

### Admin

- `/start` bosganda admin ekanligi tekshiriladi
- `Statistika`
- `CEFR natijalari`
- `IELTS natijalari`
- `Student qidirish`
- `Murojaatlar`
- `User menyuga qaytish`

## REST endpointlar

- `GET /admin/stats`
- `GET /admin/results?examType=CEFR&limit=10`
- `GET /admin/search?query=Aliyev`
- `GET /admin/leads`
- `POST /admin/users`
- `GET /results`
- `GET /results/summary`
- `GET /results/search?query=Ali`
- `POST /results`
- `GET /courses`
- `GET /courses/active`
- `POST /courses`
- `PATCH /courses/:id`
- `GET /center-info`
- `PUT /center-info`
- `GET /leads`
- `POST /leads`

## Eslatma

- `StudentResult.channelPostLink` maydoniga `https://t.me/...` ko'rinishidagi post link yoziladi
- `certificateImage` maydoniga URL yoki Telegram file id saqlash mumkin
- Conversation flow hozircha in-memory state bilan ishlaydi, ya'ni server restart bo'lsa faol yarimta flow lar tozalanadi

### Admin qo'shish body namunasi

`POST /admin/users` endpointi endi `telegramUserId` yoki `telegramUsername` dan kamida bittasi bilan ishlaydi:

```json
{
  "fullName": "Admin User",
  "telegramUserId": "123456789",
  "telegramUsername": "@admin_user"
}
```
