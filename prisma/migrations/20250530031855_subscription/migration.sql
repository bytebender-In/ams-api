/*
  Warnings:

  - The primary key for the `Organization` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Organization` table. All the data in the column will be lost.
  - The required column `orguid` was added to the `Organization` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "OrganizationUser" DROP CONSTRAINT "OrganizationUser_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_organization_id_fkey";

-- AlterTable
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_pkey",
DROP COLUMN "id",
ADD COLUMN     "orguid" TEXT NOT NULL,
ADD CONSTRAINT "Organization_pkey" PRIMARY KEY ("orguid");

-- AlterTable
ALTER TABLE "OrganizationUser" ALTER COLUMN "organization_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "organization_id" DROP NOT NULL,
ALTER COLUMN "organization_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "OrganizationUser" ADD CONSTRAINT "OrganizationUser_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("orguid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("orguid") ON DELETE SET NULL ON UPDATE CASCADE;
