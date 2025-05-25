/*
  Warnings:

  - You are about to drop the column `organization_id` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrganizationUser" DROP CONSTRAINT "OrganizationUser_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_organization_id_fkey";

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "organization_id";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "OrganizationUser";
