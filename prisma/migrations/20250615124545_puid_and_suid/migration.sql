/*
  Warnings:

  - The primary key for the `Plan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Plan` table. All the data in the column will be lost.
  - The primary key for the `Subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Subscription` table. All the data in the column will be lost.
  - The required column `puid` was added to the `Plan` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "ModuleAccess" DROP CONSTRAINT "ModuleAccess_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "ModuleAccess" DROP CONSTRAINT "ModuleAccess_subscription_id_fkey";

-- DropForeignKey
ALTER TABLE "PlanFeature" DROP CONSTRAINT "PlanFeature_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "PlanLimit" DROP CONSTRAINT "PlanLimit_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "SubscriptionLimit" DROP CONSTRAINT "SubscriptionLimit_subscription_id_fkey";

-- DropIndex
DROP INDEX "Subscription_suid_key";

-- AlterTable
ALTER TABLE "ModuleAccess" ALTER COLUMN "plan_id" SET DATA TYPE TEXT,
ALTER COLUMN "subscription_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_pkey",
DROP COLUMN "id",
ADD COLUMN     "puid" TEXT NOT NULL,
ADD CONSTRAINT "Plan_pkey" PRIMARY KEY ("puid");

-- AlterTable
ALTER TABLE "PlanFeature" ALTER COLUMN "plan_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "PlanLimit" ALTER COLUMN "plan_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_pkey",
DROP COLUMN "id",
ALTER COLUMN "plan_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY ("suid");

-- AlterTable
ALTER TABLE "SubscriptionLimit" ALTER COLUMN "subscription_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "ModuleAccess" ADD CONSTRAINT "ModuleAccess_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("puid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAccess" ADD CONSTRAINT "ModuleAccess_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscription"("suid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("puid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanLimit" ADD CONSTRAINT "PlanLimit_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("puid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionLimit" ADD CONSTRAINT "SubscriptionLimit_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscription"("suid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanFeature" ADD CONSTRAINT "PlanFeature_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("puid") ON DELETE RESTRICT ON UPDATE CASCADE;
