/*
  Warnings:

  - The primary key for the `UserVerification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `UserVerification` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `UserVerification` table. All the data in the column will be lost.
  - You are about to drop the column `otp` on the `UserVerification` table. All the data in the column will be lost.
  - You are about to drop the column `otp_expiry` on the `UserVerification` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `UserVerification` table. All the data in the column will be lost.
  - You are about to drop the column `verification_token` on the `UserVerification` table. All the data in the column will be lost.
  - Added the required column `code` to the `UserVerification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `UserVerification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identifier` to the `UserVerification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `method` to the `UserVerification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserVerification` table without a default value. This is not possible if the table is not empty.
  - The required column `uvid` was added to the `UserVerification` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `verificationType` to the `UserVerification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('EMAIL', 'PHONE');

-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('OTP', 'TOKEN');

-- AlterTable
ALTER TABLE "UserVerification" DROP CONSTRAINT "UserVerification_pkey",
DROP COLUMN "created_at",
DROP COLUMN "id",
DROP COLUMN "otp",
DROP COLUMN "otp_expiry",
DROP COLUMN "updated_at",
DROP COLUMN "verification_token",
ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "identifier" TEXT NOT NULL,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "method" "DeliveryMethod" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "uvid" TEXT NOT NULL,
ADD COLUMN     "verificationType" "VerificationType" NOT NULL,
ADD CONSTRAINT "UserVerification_pkey" PRIMARY KEY ("uvid");

-- CreateIndex
CREATE INDEX "UserVerification_userId_verificationType_identifier_idx" ON "UserVerification"("userId", "verificationType", "identifier");

-- CreateIndex
CREATE INDEX "UserVerification_code_idx" ON "UserVerification"("code");
