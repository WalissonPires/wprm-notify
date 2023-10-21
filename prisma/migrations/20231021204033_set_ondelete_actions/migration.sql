-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_accountId_fkey";

-- DropForeignKey
ALTER TABLE "ContactGroup" DROP CONSTRAINT "ContactGroup_contactId_fkey";

-- DropForeignKey
ALTER TABLE "ContactGroup" DROP CONSTRAINT "ContactGroup_groupId_fkey";

-- DropForeignKey
ALTER TABLE "ContactMetadata" DROP CONSTRAINT "ContactMetadata_contactId_fkey";

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_accountId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationTrigger" DROP CONSTRAINT "NotificationTrigger_contactId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationTrigger" DROP CONSTRAINT "NotificationTrigger_templateMessageId_fkey";

-- DropForeignKey
ALTER TABLE "TemplateMessage" DROP CONSTRAINT "TemplateMessage_accountId_fkey";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "contactId" CHAR(26),
ADD COLUMN     "createdAt" TIMESTAMP(3),
ADD COLUMN     "notes" VARCHAR(100);

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactGroup" ADD CONSTRAINT "ContactGroup_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactGroup" ADD CONSTRAINT "ContactGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactMetadata" ADD CONSTRAINT "ContactMetadata_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateMessage" ADD CONSTRAINT "TemplateMessage_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationTrigger" ADD CONSTRAINT "NotificationTrigger_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationTrigger" ADD CONSTRAINT "NotificationTrigger_templateMessageId_fkey" FOREIGN KEY ("templateMessageId") REFERENCES "TemplateMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
