/*
  Warnings:

  - You are about to drop the column `content` on the `Plan` table. All the data in the column will be lost.
  - Added the required column `interval` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ModuleType" AS ENUM ('SCHOOL', 'HOSPITAL', 'BUSINESS', 'HOTEL', 'RESTAURANT', 'STUDENT', 'TEACHER', 'CLASS', 'EXAM', 'ATTENDANCE', 'FEE', 'RESULT', 'TIMETABLE', 'PATIENT', 'DOCTOR', 'NURSE', 'APPOINTMENT', 'WARD', 'PHARMACY', 'LABORATORY', 'HOSPITAL_BILLING', 'EMPLOYEE', 'DEPARTMENT', 'PROJECT', 'BUSINESS_INVENTORY', 'SALES', 'CUSTOMER', 'ACCOUNTING', 'HR', 'ROOM', 'BOOKING', 'HOTEL_STAFF', 'SERVICE', 'HOUSEKEEPING', 'HOTEL_RESTAURANT', 'SPA', 'MENU', 'ORDER', 'TABLE', 'KITCHEN', 'RESTAURANT_INVENTORY', 'RESTAURANT_STAFF', 'RESTAURANT_BILLING', 'USER', 'ROLE', 'SETTING', 'REPORT', 'DASHBOARD', 'NOTIFICATION', 'CUSTOM');

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "content",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "interval" TEXT NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "organization_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "module_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "type" "ModuleType" NOT NULL DEFAULT 'CUSTOM',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleFeature" (
    "id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "feature_key" TEXT NOT NULL,
    "feature_value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModuleFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleAccess" (
    "id" SERIAL NOT NULL,
    "plan_id" INTEGER,
    "subscription_id" INTEGER,
    "module_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModuleAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionModuleLimit" (
    "id" SERIAL NOT NULL,
    "access_id" INTEGER NOT NULL,
    "limit_key" TEXT NOT NULL,
    "limit_value" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionModuleLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionModuleFeature" (
    "id" SERIAL NOT NULL,
    "access_id" INTEGER NOT NULL,
    "feature_key" TEXT NOT NULL,
    "feature_value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionModuleFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Module_module_key_key" ON "Module"("module_key");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleFeature_module_id_feature_key_key" ON "ModuleFeature"("module_id", "feature_key");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleAccess_subscription_id_module_id_key" ON "ModuleAccess"("subscription_id", "module_id");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleAccess_plan_id_module_id_key" ON "ModuleAccess"("plan_id", "module_id");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionModuleLimit_access_id_limit_key_key" ON "SubscriptionModuleLimit"("access_id", "limit_key");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionModuleFeature_access_id_feature_key_key" ON "SubscriptionModuleFeature"("access_id", "feature_key");

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleFeature" ADD CONSTRAINT "ModuleFeature_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAccess" ADD CONSTRAINT "ModuleAccess_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAccess" ADD CONSTRAINT "ModuleAccess_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAccess" ADD CONSTRAINT "ModuleAccess_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionModuleLimit" ADD CONSTRAINT "SubscriptionModuleLimit_access_id_fkey" FOREIGN KEY ("access_id") REFERENCES "ModuleAccess"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionModuleFeature" ADD CONSTRAINT "SubscriptionModuleFeature_access_id_fkey" FOREIGN KEY ("access_id") REFERENCES "ModuleAccess"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
