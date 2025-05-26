/*
  Warnings:

  - You are about to drop the column `user_id` on the `UserPermission` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `UserRole` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `ip_address` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `logged_in_at` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `logged_out_at` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `session_token` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `UserSession` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `UserVerification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refreshToken]` on the table `UserSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `UserPermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `UserSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `UserSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserVerification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserPermission" DROP CONSTRAINT "UserPermission_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserSession" DROP CONSTRAINT "UserSession_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserVerification" DROP CONSTRAINT "UserVerification_user_id_fkey";

-- DropIndex
DROP INDEX "UserSession_session_token_key";

-- DropIndex
DROP INDEX "UserSession_user_id_idx";

-- AlterTable
ALTER TABLE "UserPermission" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserRole" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserSession" DROP COLUMN "expires_at",
DROP COLUMN "ip_address",
DROP COLUMN "is_active",
DROP COLUMN "logged_in_at",
DROP COLUMN "logged_out_at",
DROP COLUMN "session_token",
DROP COLUMN "user_id",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "loggedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "loggedOutAt" TIMESTAMP(3),
ADD COLUMN     "refreshToken" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserVerification" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_refreshToken_key" ON "UserSession"("refreshToken");

-- CreateIndex
CREATE INDEX "UserSession_userId_idx" ON "UserSession"("userId");

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVerification" ADD CONSTRAINT "UserVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
