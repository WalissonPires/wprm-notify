-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "errorAt" TIMESTAMP(3),
ADD COLUMN     "errorMessage" VARCHAR(500);
