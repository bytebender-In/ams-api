/*
  Warnings:

  - You are about to drop the column `subscription_id` on the `PlanLimit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlanLimit" DROP CONSTRAINT "PlanLimit_subscription_id_fkey";

-- DropIndex
DROP INDEX "PlanLimit_subscription_id_limit_type_region_key";

-- AlterTable
ALTER TABLE "PlanLimit" DROP COLUMN "subscription_id";

-- CreateTable
CREATE TABLE "SubscriptionLimit" (
    "id" SERIAL NOT NULL,
    "subscription_id" INTEGER NOT NULL,
    "limit_type" TEXT NOT NULL,
    "limit_value" INTEGER NOT NULL,
    "region" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionLimit_subscription_id_limit_type_region_key" ON "SubscriptionLimit"("subscription_id", "limit_type", "region");

-- AddForeignKey
ALTER TABLE "SubscriptionLimit" ADD CONSTRAINT "SubscriptionLimit_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
