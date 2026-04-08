/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[level]` on the table `courses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "courses_title_key" ON "courses"("title");

-- CreateIndex
CREATE UNIQUE INDEX "courses_level_key" ON "courses"("level");
