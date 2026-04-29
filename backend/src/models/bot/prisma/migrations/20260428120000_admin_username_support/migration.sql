ALTER TABLE "Admin" ALTER COLUMN "telegramUserId" DROP NOT NULL;

ALTER TABLE "Admin" ADD COLUMN "telegramUsername" TEXT;

CREATE UNIQUE INDEX "Admin_telegramUsername_key" ON "Admin"("telegramUsername");

ALTER TABLE "Admin"
ADD CONSTRAINT "Admin_identifier_check"
CHECK ("telegramUserId" IS NOT NULL OR "telegramUsername" IS NOT NULL);
