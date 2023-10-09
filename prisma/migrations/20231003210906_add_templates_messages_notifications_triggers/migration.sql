-- CreateEnum
CREATE TYPE "TriggerType" AS ENUM ('Daily', 'Monthy', 'Yearly');

-- CreateTable
CREATE TABLE "TemplateMessage" (
    "id" CHAR(26) NOT NULL,
    "accountId" CHAR(26) NOT NULL,
    "name" CHAR(100) NOT NULL,
    "content" CHAR(2000) NOT NULL,
    "params" CHAR(5000) NOT NULL,

    CONSTRAINT "TemplateMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationTrigger" (
    "id" CHAR(26) NOT NULL,
    "contactId" CHAR(26) NOT NULL,
    "type" "TriggerType" NOT NULL,
    "day" INTEGER,
    "month" INTEGER,
    "templateMessageId" CHAR(26),
    "paramsValue" VARCHAR(5000) NOT NULL,

    CONSTRAINT "NotificationTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" CHAR(26) NOT NULL,
    "accountId" CHAR(26) NOT NULL,
    "triggerId" CHAR(26),
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "sendedAt" TIMESTAMP(3),
    "content" VARCHAR(2000) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TemplateMessage" ADD CONSTRAINT "TemplateMessage_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationTrigger" ADD CONSTRAINT "NotificationTrigger_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationTrigger" ADD CONSTRAINT "NotificationTrigger_templateMessageId_fkey" FOREIGN KEY ("templateMessageId") REFERENCES "TemplateMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "NotificationTrigger"("id") ON DELETE SET NULL ON UPDATE CASCADE;
