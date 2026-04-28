-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('CEFR', 'IELTS');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "telegramUserId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentResult" (
    "id" SERIAL NOT NULL,
    "studentFullName" TEXT NOT NULL,
    "examType" "ExamType" NOT NULL,
    "scoreOrLevel" TEXT NOT NULL,
    "certificateImage" TEXT NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "channelPostLink" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadRequest" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "courseType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CenterInfo" (
    "id" SERIAL NOT NULL,
    "aboutText" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone1" TEXT NOT NULL,
    "phone2" TEXT,
    "telegramUsername" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CenterInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_telegramUserId_key" ON "Admin"("telegramUserId");
