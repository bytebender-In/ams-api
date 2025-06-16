/*
  Warnings:

  - Added the required column `validity_days` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "validity_days" INTEGER NOT NULL;
