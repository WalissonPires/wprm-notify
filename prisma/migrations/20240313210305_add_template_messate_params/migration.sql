/*
  Warnings:

  - You are about to drop the column `params` on the `TemplateMessage` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TemplateMessageParamType" AS ENUM ('Text', 'File');

-- AlterTable
ALTER TABLE "TemplateMessage" DROP COLUMN "params";

-- CreateTable
CREATE TABLE "TemplateMessageParam" (
    "id" CHAR(26) NOT NULL,
    "templateMessageId" CHAR(26) NOT NULL,
    "type" "TemplateMessageParamType" NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "value" VARCHAR,

    CONSTRAINT "TemplateMessageParam_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TemplateMessageParam" ADD CONSTRAINT "TemplateMessageParam_templateMessageId_fkey" FOREIGN KEY ("templateMessageId") REFERENCES "TemplateMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
