/*
  Warnings:

  - A unique constraint covering the columns `[email,deletedAt]` on the table `Collaborator` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Collaborator_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_email_deletedAt_key" ON "Collaborator"("email", "deletedAt");
