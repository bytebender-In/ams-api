/*
  Warnings:

  - You are about to drop the column `slug` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `permissionId` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `RolePermission` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `UserRole` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserRole` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[module,action]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permission_id` to the `RolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `RolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `UserRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `UserRole` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserPermission" DROP CONSTRAINT "UserPermission_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserVerification" DROP CONSTRAINT "UserVerification_user_id_fkey";

-- DropIndex
DROP INDEX "Organization_slug_key";

-- DropIndex
DROP INDEX "User_uuid_key";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "slug",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "organizationId",
ADD COLUMN     "organization_id" INTEGER;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "organizationId",
ADD COLUMN     "organization_id" INTEGER;

-- AlterTable
ALTER TABLE "RolePermission" DROP COLUMN "permissionId",
DROP COLUMN "roleId",
ADD COLUMN     "permission_id" INTEGER NOT NULL,
ADD COLUMN     "role_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("uuid");

-- AlterTable
ALTER TABLE "UserPermission" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "UserRole" DROP COLUMN "roleId",
DROP COLUMN "userId",
ADD COLUMN     "role_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserVerification" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "UserSession" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "device" TEXT,
    "browser" TEXT,
    "ip_address" TEXT,
    "location" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "logged_in_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logged_out_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationUser" (
    "id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_session_token_key" ON "UserSession"("session_token");

-- CreateIndex
CREATE INDEX "UserSession_user_id_idx" ON "UserSession"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationUser_organization_id_user_id_key" ON "OrganizationUser"("organization_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_module_action_key" ON "Permission"("module", "action");

-- CreateIndex
CREATE INDEX "User_uuid_idx" ON "User"("uuid");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVerification" ADD CONSTRAINT "UserVerification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationUser" ADD CONSTRAINT "OrganizationUser_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
